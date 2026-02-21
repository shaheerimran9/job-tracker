const Job = require('../models/Job');

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ jobs, count: jobs.length })
};

const getJob = async (req, res) => {
    const { id: jobId } = req.params;
    
    const job = await Job.findById(jobId);
    res.status(200).json({ job });
};

const createJob = async (req, res) => {
    const { company, role, status, notes } = req.body;

    if (!company || !role) {
        const error = new Error('Company and role are required');
        error.status = 400;
        throw error;
    }

    const jobData = {
        user: req.user._id,
        company,
        role
    }

    if (status) jobData.status = status;
    if (notes) jobData.notes = notes;

    const job = await Job.create(jobData);

    res.status(201).json({ job })
};

const updateJob = async (req, res) => {
    const { id: jobId } = req.params;

    if (!req.body) {
        const err = new Error('No data provided to update');
        err.status = 400;
        throw err;
    }

    const job = await Job.findById(jobId);

    if (!job) {
        const error = new Error(`No job found with id ${jobId}`);
        error.status = 404;
        throw error;
    }

    if (!job.user.equals(req.user._id)) {
        const error = new Error(`Not authorized to update this job`);
        error.status = 403;
        throw error;
    }

    const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ updatedJob })
};

const deleteJob = async (req, res) => {
    const { id: jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
        const error = new Error(`No job found with id ${jobId}`);
        error.status = 404;
        throw error;
    }

    if (!job.user.equals(req.user._id)) {
        const error = new Error(`Not authorized to delete this job`);
        error.status = 403;
        throw error;
    }

    await job.deleteOne();
    res.status(200).json({ 'msg': `Successfully deleted job: ${jobId}` });
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob }