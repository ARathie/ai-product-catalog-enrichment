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
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
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

const getScoreDescription = (score, metric) => {
  if (score >= 85) return `Excellent ${metric.toLowerCase()} performance that exceeds industry standards`;
  if (score >= 75) return `Good ${metric.toLowerCase()} performance with some room for improvement`;
  if (score >= 65) return `Average ${metric.toLowerCase()} performance with significant improvement opportunities`;
  return `Below average ${metric.toLowerCase()} performance that needs immediate attention`;
};

function ExpandableTableRow({ row, level = 0, columns }) {
  const [open, setOpen] = useState(false);
  const hasSubcategories = row.subcategories?.length > 0;
  const hasProducts = row.products?.length > 0;
  const isProduct = !hasSubcategories && !hasProducts;
  const paddingLeft = level * 3;

  return (
    <>
      <TableRow
        sx={{
          '& > *': { borderBottom: 'unset' },
          backgroundColor: open ? (
            level === 1 ? 'rgba(0, 0, 0, 0.04)' : 
            level === 2 ? 'rgba(0, 0, 0, 0.08)' : 
            'inherit'
          ) : 'inherit'
        }}
      >
        <TableCell 
          sx={{ 
            pl: paddingLeft + 2,
            position: 'relative',
            width: '300px',
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            ml: isProduct ? 4 : 0,
            maxWidth: '100%'
          }}>
            {(hasSubcategories || hasProducts) && (
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
                sx={{ 
                  ml: level > 0 ? 1 : 0,
                  flexShrink: 0
                }}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            )}
            <Typography
              component="span"
              sx={{
                fontWeight: level === 0 ? 500 : 400,
                fontSize: level === 0 ? '1rem' : '0.875rem',
                color: level === 0 ? 'text.primary' : 'text.secondary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                minWidth: 0,
                flex: 1
              }}
            >
              {row.name}
            </Typography>
          </Box>
        </TableCell>
        {columns.map((column) => (
          <ScoreCell 
            key={column} 
            score={row[column.toLowerCase().replace(/\s+/g, '')]} 
            metric={column}
          />
        ))}
      </TableRow>
      {open && (hasSubcategories || hasProducts) && (
        <TableRow>
          <TableCell 
            colSpan={columns.length + 1} 
            sx={{ 
              p: 0,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${paddingLeft + 2}px`,
                width: '2px',
                backgroundColor: 'rgba(0, 0, 0, 0.12)',
                zIndex: 1,
                display: level === 0 ? 'block' : 'none'
              },
              ...(level === 1 && {
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${paddingLeft + 5}px`,
                  width: '2px',
                  backgroundColor: 'rgba(0, 0, 0, 0.12)',
                  zIndex: 1,
                  display: 'block'
                }
              })
            }}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box>
                <Table 
                  size="small" 
                  sx={{
                    '& td, & th': {
                      py: 1.5,
                      px: 2,
                      borderBottom: '1px solid rgba(224, 224, 224, 1)',
                    },
                    '& tr:last-child td': {
                      borderBottom: 0
                    }
                  }}
                >
                  <TableBody>
                    {row.subcategories?.map((subcategory) => (
                      <ExpandableTableRow
                        key={subcategory.name}
                        row={subcategory}
                        level={level + 1}
                        columns={columns}
                      />
                    ))}
                    {row.products?.map((product) => (
                      <ExpandableTableRow
                        key={product.name}
                        row={product}
                        level={level + 1}
                        columns={columns}
                      />
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

function CategoryScores() {
  const columns = [
    'Overall Attributes',
    'Attribute Relevance',
    'Attribute Consistency',
    'Attribute Impact',
    'Keywords',
    'Image Quality',
    'Competitive Benchmark'
  ];

  const categoryData = [
    {
      name: "Electronics",
      overallattributes: 84,
      attributerelevance: 78,
      attributeconsistency: 72,
      attributeimpact: 88,
      keywords: 82,
      imagequality: 92,
      competitivebenchmark: 75,
      subcategories: [
        {
          name: "Smartphones",
          overallattributes: 86,
          attributerelevance: 82,
          attributeconsistency: 75,
          attributeimpact: 90,
          keywords: 85,
          imagequality: 94,
          competitivebenchmark: 78,
          products: [
            {
              name: "iPhone 13 Pro",
              overallattributes: 88,
              attributerelevance: 85,
              attributeconsistency: 78,
              attributeimpact: 92,
              keywords: 87,
              imagequality: 95,
              competitivebenchmark: 80
            },
            {
              name: "Samsung Galaxy S21",
              overallattributes: 87,
              attributerelevance: 83,
              attributeconsistency: 76,
              attributeimpact: 91,
              keywords: 86,
              imagequality: 93,
              competitivebenchmark: 79
            }
          ]
        },
        {
          name: "Laptops",
          overallattributes: 82,
          attributerelevance: 76,
          attributeconsistency: 70,
          attributeimpact: 86,
          keywords: 80,
          imagequality: 90,
          competitivebenchmark: 73,
          products: [
            {
              name: "MacBook Pro 16",
              overallattributes: 84,
              attributerelevance: 78,
              attributeconsistency: 72,
              attributeimpact: 88,
              keywords: 82,
              imagequality: 92,
              competitivebenchmark: 75
            },
            {
              name: "Dell XPS 15",
              overallattributes: 80,
              attributerelevance: 74,
              attributeconsistency: 68,
              attributeimpact: 84,
              keywords: 78,
              imagequality: 88,
              competitivebenchmark: 71
            }
          ]
        }
      ]
    },
    {
      name: "Apparel",
      overallattributes: 79,
      attributerelevance: 82,
      attributeconsistency: 65,
      attributeimpact: 85,
      keywords: 77,
      imagequality: 88,
      competitivebenchmark: 73,
      subcategories: [
        {
          name: "Men's Clothing",
          overallattributes: 80,
          attributerelevance: 83,
          attributeconsistency: 66,
          attributeimpact: 86,
          keywords: 78,
          imagequality: 89,
          competitivebenchmark: 74,
          products: [
            {
              name: "Classic Fit Dress Shirt",
              overallattributes: 82,
              attributerelevance: 85,
              attributeconsistency: 68,
              attributeimpact: 88,
              keywords: 80,
              imagequality: 91,
              competitivebenchmark: 76
            },
            {
              name: "Slim Fit Chinos",
              overallattributes: 78,
              attributerelevance: 81,
              attributeconsistency: 64,
              attributeimpact: 84,
              keywords: 76,
              imagequality: 87,
              competitivebenchmark: 72
            }
          ]
        },
        {
          name: "Women's Clothing",
          overallattributes: 78,
          attributerelevance: 81,
          attributeconsistency: 64,
          attributeimpact: 84,
          keywords: 76,
          imagequality: 87,
          competitivebenchmark: 72,
          products: [
            {
              name: "Floral Summer Dress",
              overallattributes: 80,
              attributerelevance: 83,
              attributeconsistency: 66,
              attributeimpact: 86,
              keywords: 78,
              imagequality: 89,
              competitivebenchmark: 74
            },
            {
              name: "High-Waist Jeans",
              overallattributes: 76,
              attributerelevance: 79,
              attributeconsistency: 62,
              attributeimpact: 82,
              keywords: 74,
              imagequality: 85,
              competitivebenchmark: 70
            }
          ]
        }
      ]
    },
    {
      name: "Home Goods",
      overallattributes: 76,
      attributerelevance: 70,
      attributeconsistency: 68,
      attributeimpact: 82,
      keywords: 75,
      imagequality: 85,
      competitivebenchmark: 69,
      subcategories: [
        {
          name: "Furniture",
          overallattributes: 77,
          attributerelevance: 71,
          attributeconsistency: 69,
          attributeimpact: 83,
          keywords: 76,
          imagequality: 86,
          competitivebenchmark: 70,
          products: [
            {
              name: "Modern Sofa Set",
              overallattributes: 79,
              attributerelevance: 73,
              attributeconsistency: 71,
              attributeimpact: 85,
              keywords: 78,
              imagequality: 88,
              competitivebenchmark: 72
            },
            {
              name: "Dining Table Set",
              overallattributes: 75,
              attributerelevance: 69,
              attributeconsistency: 67,
              attributeimpact: 81,
              keywords: 74,
              imagequality: 84,
              competitivebenchmark: 68
            }
          ]
        },
        {
          name: "Kitchen",
          overallattributes: 75,
          attributerelevance: 69,
          attributeconsistency: 67,
          attributeimpact: 81,
          keywords: 74,
          imagequality: 84,
          competitivebenchmark: 68,
          products: [
            {
              name: "Cookware Set",
              overallattributes: 77,
              attributerelevance: 71,
              attributeconsistency: 69,
              attributeimpact: 83,
              keywords: 76,
              imagequality: 86,
              competitivebenchmark: 70
            },
            {
              name: "Kitchen Appliance Bundle",
              overallattributes: 73,
              attributerelevance: 67,
              attributeconsistency: 65,
              attributeimpact: 79,
              keywords: 72,
              imagequality: 82,
              competitivebenchmark: 66
            }
          ]
        }
      ]
    },
    {
      name: "Beauty",
      overallattributes: 88,
      attributerelevance: 85,
      attributeconsistency: 80,
      attributeimpact: 87,
      keywords: 84,
      imagequality: 95,
      competitivebenchmark: 82,
      subcategories: [
        {
          name: "Skincare",
          overallattributes: 90,
          attributerelevance: 87,
          attributeconsistency: 82,
          attributeimpact: 89,
          keywords: 86,
          imagequality: 97,
          competitivebenchmark: 84,
          products: [
            {
              name: "Anti-Aging Serum",
              overallattributes: 92,
              attributerelevance: 89,
              attributeconsistency: 84,
              attributeimpact: 91,
              keywords: 88,
              imagequality: 99,
              competitivebenchmark: 86
            },
            {
              name: "Hydrating Moisturizer",
              overallattributes: 88,
              attributerelevance: 85,
              attributeconsistency: 80,
              attributeimpact: 87,
              keywords: 84,
              imagequality: 95,
              competitivebenchmark: 82
            }
          ]
        },
        {
          name: "Makeup",
          overallattributes: 86,
          attributerelevance: 83,
          attributeconsistency: 78,
          attributeimpact: 85,
          keywords: 82,
          imagequality: 93,
          competitivebenchmark: 80,
          products: [
            {
              name: "Long-Wear Foundation",
              overallattributes: 88,
              attributerelevance: 85,
              attributeconsistency: 80,
              attributeimpact: 87,
              keywords: 84,
              imagequality: 95,
              competitivebenchmark: 82
            },
            {
              name: "Eyeshadow Palette",
              overallattributes: 84,
              attributerelevance: 81,
              attributeconsistency: 76,
              attributeimpact: 83,
              keywords: 80,
              imagequality: 91,
              competitivebenchmark: 78
            }
          ]
        }
      ]
    }
  ];

  return (
    <TableContainer component={Paper}>
      <Table aria-label="category scores table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '300px' }}>Category</TableCell>
            {columns.map((column) => (
              <TableCell key={column} align="right">{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {categoryData.map((category) => (
            <ExpandableTableRow
              key={category.name}
              row={category}
              columns={columns}
            />
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