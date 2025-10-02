const express = require('express');
const cors = require('cors');
const path = require('path');
const authenticate = require('./middleware/authenticate');

// Import all your route groups
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const orgRoutes = require('./routes/orgRoutes');
const strategyRoutes = require('./routes/strategic.routes');
const participantRoutes = require('./routes/participantRoutes');
const generalRoutes = require('./routes/generalRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const metaDataRoutes = require('./routes/metaDataRoutes');
const taskRoutes = require('./routes/taskRoutes');
const milestoneRoutes = require('./routes/milestoneRoutes');
const taskAssigneesRoutes = require('./routes/taskAssigneesRoutes');
const taskDependenciesRoutes = require('./routes/taskDependenciesRoutes');
const contractorRoutes = require('./routes/contractorRoutes');
const paymentRequestRoutes = require('./routes/paymentRequestRoutes');
const contractorPhotoRoutes = require('./routes/contractorPhotoRoutes');
const hrRoutes = require('./routes/humanResourceRoutes');
const projectDocumentsRoutes = require('./routes/projectDocumentsRoutes');
const workflowRoutes = require('./routes/projectWorkflowRoutes');
const approvalLevelsRoutes = require('./routes/approvalLevelsRoutes');
const paymentStatusRoutes = require('./routes/paymentStatusRoutes');
const dashboardConfigRoutes = require('./routes/dashboardConfigRoutes');
const dataAccessRoutes = require('./routes/dataAccessRoutes');

// NEW: Consolidated reporting routes under a single router
const reportsRouter = require('./routes/reportsRouter')
const projectRouter = require('./routes/projectRouter')

const port = 3000;
const app = express();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('Welcome to the KEMRI CRUD API!');
});

app.use('/api/auth', authRoutes);

// IMPORTANT: Mount the new dedicated routers
// The reports router is mounted first to prevent conflicts with project routes.
app.use('/api/reports', reportsRouter);

// Dashboard configuration routes (public for testing)
app.use('/api/dashboard', dashboardConfigRoutes);

// Data access control routes (public for testing)
app.use('/api/data-access', dataAccessRoutes);

app.use('/api', authenticate);
app.use('/api/projects', projectRouter);

// Mount other top-level routers
app.use('/api/users', userRoutes);
app.use('/api/organization', orgRoutes);
app.use('/api/strategy', strategyRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/general', generalRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/metadata', metaDataRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/task_assignees', taskAssigneesRoutes);
app.use('/api/task_dependencies', taskDependenciesRoutes);
app.use('/api/contractors', contractorRoutes);
app.use('/api/contractor-photos', contractorPhotoRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/projects/documents', projectDocumentsRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/approval-levels', approvalLevelsRoutes);
app.use('/api/payment-status', paymentStatusRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || 'An unexpected error occurred.';
    res.status(statusCode).json({
        message: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
});

app.listen(port, () => {
    console.log(`IMPES API listening at http://localhost:${port}`);
    console.log(`CORS enabled for all origins during development.`);
});

module.exports = app;