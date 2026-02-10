const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool: db } = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
    '/',
    authMiddleware,
    [
        body('distance_km').isFloat({ gt: 0 }),
        body('duration_min').isInt({ gt: 0 }),
        body('run_date').isISO8601().toDate()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const userId = req.user.id;
            const { distance_km, duration_min, run_date } = req.body;

            const [result] = await db.execute(
                'INSERT INTO runs (user_id, distance_km, duration_min, run_date) VALUES (?, ?, ?, ?)',
                [userId, distance_km, duration_min, run_date]
            );

            res.status(201).json({
                mensaje: 'Carrera guardada',
                run: {
                    id: result.insertId,
                    user_id: userId,
                    distance_km,
                    duration_min,
                    run_date
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error servidor' });
        }
    }
);


router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await db.execute(
            'SELECT * FROM runs WHERE user_id = ? ORDER BY run_date DESC, created_at DESC',
            [userId]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error servidor' });
    }
});

module.exports = router;
