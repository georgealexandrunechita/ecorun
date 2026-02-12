const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const bcrypt = require('bcrypt');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');


router.post(
    '/register',
    [
        body('username')
            .trim()
            .isLength({ min: 3, max: 50 })
            .withMessage('Username debe tener entre 3 y 50 caracteres')
            .matches(/^[a-zA-Z0-9_]+$/)
            .withMessage('Username solo puede contener letras, números y guiones bajos'),
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Email inválido'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password debe tener mínimo 6 caracteres')
    ],
    validateRequest,
    async (req, res) => {
        const { username, email, password } = req.body;

        try {
            const passwordHash = await bcrypt.hash(password, 10);

            const sql = `
        INSERT INTO users (username, email, password_hash, role, eco_points)
        VALUES (?, ?, ?, 'user', 0)`;

            const [result] = await pool.query(sql, [username, email, passwordHash]);

            return res.status(201).json({
                id: result.insertId,
                username,
                email,
                message: 'Usuario registrado exitosamente'
            });
        } catch (err) {
            console.error(err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'Username o email ya existen' });
            }
            return res.status(500).json({ error: 'Error en la base de datos' });
        }
    }
);


router.post(
    '/login',
    [
        body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
        body('password').notEmpty().withMessage('Password requerido')
    ],
    validateRequest,
    async (req, res) => {
        const { email, password } = req.body;

        try {
            const sql = 'SELECT * FROM users WHERE email = ? LIMIT 1';
            const [rows] = await pool.query(sql, [email]);

            if (rows.length === 0) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            const user = rows[0];
            const ok = await bcrypt.compare(password, user.password_hash);
            if (!ok) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            const { password_hash, ...userWithoutPassword } = user;

            return res.json({
                message: 'Login exitoso',
                user: userWithoutPassword
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }
    }
);

router.get('/user/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const sql = `
        SELECT id, username, email, eco_points, role, created_at
        FROM users
        WHERE id = ?
    `;
        const [rows] = await pool.query(sql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        return res.json(rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error en la base de datos' });
    }
});

module.exports = router;
