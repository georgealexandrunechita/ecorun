const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { pool: db } = require('../db');

const router = express.Router();

router.post(
    '/register',
    [
        body('username').isLength({ min: 3 }),
        body('email').isEmail(),
        body('password').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { username, email, password } = req.body;

            const [existing] = await db.execute(
                'SELECT id FROM users WHERE email = ? OR username = ?',
                [email, username]
            );
            if (existing.length > 0) {
                return res.status(400).json({ error: 'Usuario ya existe' });
            }

            const hashed = await bcrypt.hash(password, 10);

            const [result] = await db.execute(
                'INSERT INTO users (username, email, password_hash, eco_points, role, created_at) VALUES (?, ?, ?, 0, "user", NOW())',
                [username, email, hashed]
            );

            const token = jwt.sign(
                { userId: result.insertId },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                mensaje: 'Usuario creado',
                token,
                user: { id: result.insertId, username, email }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error servidor' });
        }
    }
);

router.post(
    '/login',
    [
        body('email').isEmail(),
        body('password').notEmpty()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;

            const [rows] = await db.execute(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            const user = rows[0];

            if (!user) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            const ok = await bcrypt.compare(password, user.password_hash);
            if (!ok) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                mensaje: 'Login OK',
                token,
                user: { id: user.id, username: user.username, email: user.email }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error servidor' });
        }
    }
);

module.exports = router;
