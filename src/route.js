const express = require('express')
const router = express.Router()
 
router.get('/health', (req, res) => {
    res.json({ status: 'OK' })
})
 
router.get('/time', (req, res) => {
    const now = new Date()
    res.json({ time: now.toISOString() })
})
 
module.exports = router