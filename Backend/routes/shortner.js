const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const Shortner = require('../models/Shortner');

function isAlphanumeric(str) {
  return /^[a-zA-Z0-9_-]{4,20}$/.test(str);
}

router.post('/shorten', async (req, res) => {
  try {
    const { url, customCode, validity } = req.body;
    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

   
    let formattedUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      formattedUrl = 'https://' + url;
    }

   
    let shortCode = customCode || shortid.generate();
    if (customCode) {
      if (!isAlphanumeric(customCode)) {
        return res.status(400).json({ message: 'Invalid custom shortcode. Must be alphanumeric and 4–20 characters.' });
      }
      const exists = await Shortner.findOne({ short: customCode });
      if (exists) return res.status(409).json({ message: 'Custom shortcode already in use.' });
    }

    const duration = validity ? parseInt(validity) : 30;
    const expiryDate = new Date(Date.now() + duration * 60000);

    const newEntry = new Shortner({
      original: formattedUrl,
      short: shortCode,
      expiresAt: expiryDate
    });

    await newEntry.save();

    res.status(201).json({
      message: 'Short URL created successfully',
      originalUrl: formattedUrl,
      shortUrl: `${req.protocol}://${req.headers.host}/${shortCode}`,
      expiresAt: expiryDate
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const entry = await Shortner.findOne({ short: shortCode });

    if (!entry) return res.status(404).json({ message: 'Shortcode does not exist.' });

    if (new Date() > entry.expiresAt) {
      return res.status(410).json({ message: 'This short URL has expired.' });
    }

    res.redirect(entry.original);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
