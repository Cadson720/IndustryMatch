const sequelize = require('../config/database');
const Academic = require('./academic');
const Admin = require('./admin');
const EOI = require('./eoi');
const ExpressionOfInterest = require('./eoi');
const Industry = require('./industry');
const Project = require('./project');
const User = require('./user');
const SavedProject = require('./savedProject')

const db = {
  Academic,
  Industry,
  Project,
  Admin,
  EOI,
  SavedProject,
  sequelize
};

// Define associations after models are loaded
Academic.hasMany(SavedProject, { foreignKey: 'academic_id' });
Project.hasMany(SavedProject, { foreignKey: 'project_id' });
Project.belongsTo(Industry, { foreignKey: 'industry_id' });

SavedProject.belongsTo(Academic, { foreignKey: 'academic_id' });
SavedProject.belongsTo(Project, { foreignKey: 'project_id' });

// Define the associations
EOI.belongsTo(Industry, { foreignKey: 'industry_id' });
EOI.belongsTo(Academic, { foreignKey: 'academic_id' });
EOI.belongsTo(Project, { foreignKey: 'project_id' });


module.exports = db;