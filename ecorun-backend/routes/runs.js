const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');

router.post(
  '/',
  [
    body('user_id').isInt().withMessage('user_id debe ser un número'),
    body('run_name').trim().notEmpty().withMessage('run_name es requerido'),
    body('distance_km')
      .isFloat({ min: 0.1 })
      .withMessage('distance_km debe ser mayor a 0'),
    body('duration_minutes')
      .isInt({ min: 1 })
      .withMessage('duration_minutes debe ser mayor a 0'),
    body('start_time').isISO8601().withMessage('start_time debe ser una fecha válida'),
    body('end_time').isISO8601().withMessage('end_time debe ser una fecha válida'),
    body('run_date').isISO8601().withMessage('run_date debe ser una fecha válida')
  ],
  validateRequest,
  (req, res) => {
    const {
      user_id,
      run_name,
      description,
      distance_km,
      duration_minutes,
      start_time,
      end_time,
      run_date,
      points_earned
    } = req.body;

    const sql = `
      INSERT INTO runs
      (user_id, run_name, description, distance_km, duration_minutes, start_time, end_time, run_date, points_earned)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const calculatedPoints = points_earned || Math.round(distance_km * 10);

    pool.query(
      sql,
      [
        user_id,
        run_name,
        description || null,
        distance_km,
        duration_minutes,
        start_time,
        end_time,
        run_date,
        calculatedPoints
      ],
      (err, result) => {
        if (err) {
          console.error('Error insertando run:', err);
          return res.status(500).json({ error: 'Error en la base de datos' });
        }

        res.status(201).json({
          id: result.insertId,
          points_earned: calculatedPoints,
          message: 'Run creado exitosamente'
        });
      }
    );
  }
);

router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT *
    FROM runs
    WHERE user_id = ?
    ORDER BY run_date DESC
  `;

  pool.query(sql, [userId], (err, rows) => {
    if (err) {
      console.error('Error obteniendo runs:', err);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }
    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'SELECT * FROM runs WHERE id = ?';

  pool.query(sql, [id], (err, rows) => {
    if (err) {
      console.error('Error obteniendo run:', err);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Run no encontrado' });
    }

    res.json(rows[0]);
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM runs WHERE id = ?';

  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error eliminando run:', err);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Run no encontrado' });
    }

    res.json({ message: 'Run eliminado exitosamente' });
  });
});

module.exports = router;
