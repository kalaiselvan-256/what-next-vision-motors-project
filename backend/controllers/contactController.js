const ContactMessage = require('../models/ContactMessage');

// @desc    Submit a contact / inquiry message
// @route   POST /api/contact
// @access  Public
const submitMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, inquiryType, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (Name, Email, Subject, Message).',
      });
    }

    const contact = await ContactMessage.create({
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      subject,
      inquiryType: inquiryType || 'General Inquiry',
      message,
      status: 'New',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to WhatNext Vision Motors. Our client relations team will contact you within 24 hours.',
      contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact
// @access  Private/Admin
const getAllMessages = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { subject: searchRegex },
        { message: searchRegex },
      ];
    }

    const messages = await ContactMessage.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact message status / add reply notes (Admin)
// @route   PUT /api/contact/:id
// @access  Private/Admin
const updateMessageStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    const contact = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found with specified ID',
      });
    }

    res.json({
      success: true,
      message: 'Contact message updated successfully',
      contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message (Admin)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteMessage = async (req, res, next) => {
  try {
    const contact = await ContactMessage.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message not found with specified ID',
      });
    }

    await contact.deleteOne();

    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitMessage,
  getAllMessages,
  updateMessageStatus,
  deleteMessage,
};
