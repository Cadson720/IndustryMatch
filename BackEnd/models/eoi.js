const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Industry = require('./industry'); // Import Industry model
const Academic = require('./academic'); // Import Academic model
const Project = require('./project'); // Import Project model

const EOI = sequelize.define('EOIs', {
    eoi_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    industry_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Industries',
        key: 'industry_id'
      },
      allowNull: true
    },
    academic_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Academics',
        key: 'academic_id'
      },
      allowNull: true
    },
    project_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Projects',
        key: 'project_id'
      },
      allowNull: true
    },
    eoi_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    class_size: {
      type: DataTypes.STRING,
      allowNull: false
    },
    school: {
      type: DataTypes.STRING,
      references: {
        model: 'Academics',
        key: 'school'
      },
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      references: {
        model: 'Academics',
        key: 'role'
      },
      allowNull: false
    },
    academic_email: {
      type: DataTypes.STRING,
      references: {
        model: 'Academics',
        key: 'academic_email'
      },
      allowNull: false
    },
    industry_email: {
      type: DataTypes.STRING,
      references: {
        model: 'Industries',
        key: 'industry_email'
      },
      allowNull: false
    },
    eoi_status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  });

// Define the association (Project belongs to an Industry)
EOI.belongsTo(Industry, { foreignKey: 'industry_id' });
EOI.belongsTo(Academic, { foreignKey: 'academic_id' });
EOI.belongsTo(Project, { foreignKey: 'project_id' });
EOI.belongsTo(Academic, { foreignKey: 'school' });
EOI.belongsTo(Academic, { foreignKey: 'role' });
EOI.belongsTo(Academic, { foreignKey: 'academic_email' });
EOI.belongsTo(Industry, { foreignKey: 'industry_email' });

module.exports = EOI;