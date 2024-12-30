import React, { useState, useEffect } from 'react';
import {
  Card,
  CircularProgress,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Paper,
  Tooltip,
  Tabs,
  Tab,
  IconButton,
  Collapse,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import UploadButton from './UploadButton';
import LoadingSpinner from './LoadingSpinner';
import InfoIcon from '@mui/icons-material/Info';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './CatalogAssessment.css';

function ScoreCard({ title, score, description }) {
  const tooltipContent = {
    'Overall Attributes': 'Evaluates the completeness and quality of key product attributes',
    'Attribute Relevance': 'Are attributes aligned with customer expectations?',
    'Attribute Consistency': 'Is there standardized terminology across products',
    'Attribute Impact': 'Do attributes aid in search relevance or filtering',
    'Keywords': 'Rates titles and descriptions for high-value search terms',
    'Image Quality': 'Scores image quality, consistency and metadata',
    'Competitive Benchmark': 'Benchmark the catalog against competitors standards'
  };

  return (
    <Paper className="score-card" elevation={1}>
      <Box className="score-header">
        <Typography variant="h6" className="score-title">
          {title}
        </Typography>
        <Tooltip title={tooltipContent[title]} arrow placement="top">
          <InfoIcon className="info-icon" />
        </Tooltip>
      </Box>
      <Box className="score-circle-container">
        <CircularProgress
          variant="determinate"
          value={score}
          size={80}
          thickness={4}
          className="score-circle"
        />
        <Typography variant="h4" className="score-value">
          {score}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={score}
        className="score-bar"
      />
      <Typography variant="body2" className="score-description">
        {description}
      </Typography>
    </Paper>
  );
}

function TabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`catalog-tabpanel-${index}`}
      aria-labelledby={`catalog-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function CategoryScores() {
  const getScoreDescription = (score, metric) => {
    if (score >= 85) return `Excellent ${metric.toLowerCase()} performance that exceeds industry standards`;
    if (score >= 75) return `Good ${metric.toLowerCase()} performance with some room for improvement`;
    if (score >= 65) return `Average ${metric.toLowerCase()} performance with significant improvement opportunities`;
    return `Below average ${metric.toLowerCase()} performance that needs immediate attention`;
  };

  const categoryData = [
    {
      category: "Electronics",
      overallAttributes: 84,
      attributeRelevance: 78,
      attributeConsistency: 72,
      attributeImpact: 88,
      keywords: 82,
      imageQuality: 92,
      competitiveBenchmark: 75,
    },
    {
      category: "Apparel",
      overallAttributes: 79,
      attributeRelevance: 82,
      attributeConsistency: 65,
      attributeImpact: 85,
      keywords: 77,
      imageQuality: 88,
      competitiveBenchmark: 73,
    },
    {
      category: "Home Goods",
      overallAttributes: 76,
      attributeRelevance: 70,
      attributeConsistency: 68,
      attributeImpact: 82,
      keywords: 75,
      imageQuality: 85,
      competitiveBenchmark: 69,
    },
    {
      category: "Beauty",
      overallAttributes: 88,
      attributeRelevance: 85,
      attributeConsistency: 80,
      attributeImpact: 87,
      keywords: 84,
      imageQuality: 95,
      competitiveBenchmark: 82,
    },
  ];

  const ScoreCell = ({ score, metric }) => (
    <TableCell align="right">
      <Tooltip title={getScoreDescription(score, metric)} arrow placement="top">
        <Box 
          sx={{ 
            position: 'relative', 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CircularProgress
            variant="determinate"
            value={score}
            size={40}
            thickness={4}
            sx={{
              color: (theme) => {
                if (score >= 85) return theme.palette.success.main;
                if (score >= 75) return theme.palette.info.main;
                if (score >= 65) return theme.palette.warning.main;
                return theme.palette.error.main;
              }
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
              sx={{ fontSize: '0.8rem' }}
            >
              {score}
            </Typography>
          </Box>
        </Box>
      </Tooltip>
    </TableCell>
  );

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="category scores table">
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell align="right">Overall Attributes</TableCell>
            <TableCell align="right">Attribute Relevance</TableCell>
            <TableCell align="right">Attribute Consistency</TableCell>
            <TableCell align="right">Attribute Impact</TableCell>
            <TableCell align="right">Keywords</TableCell>
            <TableCell align="right">Image Quality</TableCell>
            <TableCell align="right">Competitive Benchmark</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categoryData.map((row) => (
            <TableRow
              key={row.category}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.category}
              </TableCell>
              <ScoreCell score={row.overallAttributes} metric="Overall Attributes" />
              <ScoreCell score={row.attributeRelevance} metric="Attribute Relevance" />
              <ScoreCell score={row.attributeConsistency} metric="Attribute Consistency" />
              <ScoreCell score={row.attributeImpact} metric="Attribute Impact" />
              <ScoreCell score={row.keywords} metric="Keywords" />
              <ScoreCell score={row.imageQuality} metric="Image Quality" />
              <ScoreCell score={row.competitiveBenchmark} metric="Competitive Benchmark" />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function RecommendationCard({ title, description }) {
  const [expanded, setExpanded] = useState(false);

  const handleCardClick = (event) => {
    if (!event.target.closest('.fix-button')) {
      setExpanded(!expanded);
    }
  };

  return (
    <Paper 
      className="recommendation-card"
      onClick={handleCardClick}
      sx={{ cursor: 'pointer' }}
    >
      <div className="recommendation-content">
        <div className="recommendation-main">
          <div className="recommendation-text">
            <div className="recommendation-header">
              <IconButton
                className={`expand-button ${expanded ? 'expanded' : ''}`}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </IconButton>
              <Typography variant="h6" className="recommendation-title">
                {title}
              </Typography>
            </div>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Typography variant="body2" className="recommendation-description">
                {description}
              </Typography>
            </Collapse>
          </div>
          <div className="recommendation-actions">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AutoFixHighIcon />}
              className="fix-button"
            >
              Fix with AI
            </Button>
          </div>
        </div>
      </div>
    </Paper>
  );
}

function AIRecommendations() {
  const recommendations = [
    {
      title: "Improve Keyword Density for Electronics",
      description: "Electronics category products show lower keyword density compared to industry standards. AI can enhance product descriptions with relevant technical specifications and search-optimized terminology while maintaining natural readability."
    },
    {
      title: "Increase Image Consistency for Apparel",
      description: "Apparel products lack consistent alternative view angles and styling. AI can analyze current images and identify products needing additional views to match best-performing listings in your catalog."
    },
    {
      title: "Focus on Competitive Attributes for Home Goods",
      description: "Home goods category is missing key competitive attributes present in top-performing competitor listings. AI can identify and generate missing attributes to improve category performance."
    },
    {
      title: "Missing Product Attributes",
      description: "We detected 245 products missing key attributes like size, color, and material. AI can automatically generate these attributes based on product descriptions and images."
    },
    {
      title: "Inconsistent Attribute Formatting",
      description: "Found varying formats for size attributes (S/M/L vs Small/Medium/Large). AI can standardize these formats across your catalog."
    },
    {
      title: "Incomplete Product Descriptions",
      description: "127 products have descriptions shorter than recommended length. AI can expand these descriptions with relevant details from existing content."
    },
    {
      title: "Non-Optimized Product Titles",
      description: "312 product titles lack important keywords. AI can enhance titles while maintaining readability and search relevance."
    }
  ];

  return (
    <div className="recommendations-container">
      {recommendations.map((rec, index) => (
        <RecommendationCard
          key={index}
          title={rec.title}
          description={rec.description}
        />
      ))}
    </div>
  );
}

function SubScores({ scores }) {
  return (
    <Grid container spacing={3} className="score-grid">
      {scores.categories.map((category, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <ScoreCard {...category} />
        </Grid>
      ))}
    </Grid>
  );
}

function CatalogAssessment({ savedState, onStateChange }) {
  const [selectedFile, setSelectedFile] = useState(savedState?.selectedFile || null);
  const [fileContent, setFileContent] = useState(savedState?.fileContent || null);
  const [assessmentResult, setAssessmentResult] = useState(savedState?.assessmentResult || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEnhanceModal, setShowEnhanceModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    onStateChange({
      selectedFile,
      fileContent,
      assessmentResult,
    });
  }, [selectedFile, fileContent, assessmentResult, onStateChange]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleUpload = async (file) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAssessmentResult({
        overall: 78,
        categories: [
          {
            title: 'Overall Attributes',
            score: 82,
            description: 'Good attribute coverage across products'
          },
          {
            title: 'Attribute Relevance',
            score: 75,
            description: 'Most attributes are relevant to products'
          },
          {
            title: 'Attribute Consistency',
            score: 68,
            description: 'Some inconsistencies in attribute formatting'
          },
          {
            title: 'Attribute Impact',
            score: 85,
            description: 'Strong impact on customer decision making'
          },
          {
            title: 'Keywords',
            score: 79,
            description: 'Good keyword optimization'
          },
          {
            title: 'Image Quality',
            score: 90,
            description: 'Excellent image quality and consistency'
          },
          {
            title: 'Competitive Benchmark',
            score: 71,
            description: 'Above average compared to competitors'
          }
        ]
      });
      setIsLoading(false);
    }, 2000);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="catalog-assessment">
      {!assessmentResult ? (
        <Card className="upload-section">
          <Typography variant="h5" gutterBottom>
            Run Catalog Assessment
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Upload your product catalog to analyze its quality and receive detailed insights
          </Typography>
          <UploadButton onUpload={handleUpload} />
        </Card>
      ) : (
        <>
          <Card className="overall-score-card">
            <Typography variant="h4" gutterBottom>
              Catalog Assessment Results
            </Typography>
            <Box className="overall-score">
              <CircularProgress
                variant="determinate"
                value={assessmentResult.overall}
                size={120}
                thickness={4}
                className="overall-progress"
              />
              <Typography variant="h2" className="overall-value">
                {assessmentResult.overall}
              </Typography>
            </Box>
          </Card>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              aria-label="catalog assessment tabs"
              centered
            >
              <Tab label="Subscores" />
              <Tab label="Category Scores" />
              <Tab label="AI Recommendations" />
            </Tabs>
          </Box>

          <TabPanel value={activeTab} index={0}>
            <SubScores scores={assessmentResult} />
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <CategoryScores />
          </TabPanel>
          <TabPanel value={activeTab} index={2}>
            <AIRecommendations />
          </TabPanel>
        </>
      )}
    </div>
  );
}

export default CatalogAssessment; 