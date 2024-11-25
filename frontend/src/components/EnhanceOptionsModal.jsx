   // frontend/src/components/EnhanceOptionsModal.jsx
   import React from 'react';
   import {
     Dialog,
     DialogTitle,
     DialogContent,
     DialogActions,
     Button,
     Switch,
     TextField,
     Typography,
     Box
   } from '@mui/material';
   import './EnhanceOptionsModal.css';

   function EnhanceOptionsModal({
     open,
     handleClose,
     options,
     setOptions,
     handleConfirm
   }) {
     return (
       <Dialog 
         open={open} 
         onClose={handleClose}
         maxWidth="sm"
         fullWidth
         className="enhancement-modal"
       >
         <DialogTitle>
           <Typography variant="h5" className="modal-title">
             Enhancement Options
           </Typography>
         </DialogTitle>
         <DialogContent>
           <Box className="options-container">
             <div className="option-item">
               <div className="option-content">
                 <Typography variant="subtitle1" className="option-label">
                   Fill in Data Gaps
                 </Typography>
                 <Typography variant="body2" className="option-description">
                   Complete missing product information automatically
                 </Typography>
               </div>
               <Switch
                 checked={options.fillInDataGaps}
                 onChange={(e) => setOptions(prev => ({...prev, fillInDataGaps: e.target.checked}))}
                 color="primary"
                 className="option-switch"
               />
             </div>

             <div className="option-item">
               <div className="option-content">
                 <Typography variant="subtitle1" className="option-label">
                   Fix Categories
                 </Typography>
                 <Typography variant="body2" className="option-description">
                   Standardize and correct product categorization
                 </Typography>
               </div>
               <Switch
                 checked={options.fixCategories}
                 onChange={(e) => setOptions(prev => ({...prev, fixCategories: e.target.checked}))}
                 color="primary"
               />
             </div>

             <div className="option-item">
               <div className="option-content">
                 <Typography variant="subtitle1" className="option-label">
                   Generate New Attributes
                 </Typography>
                 <Typography variant="body2" className="option-description">
                   Add helpful product attributes and tags
                 </Typography>
               </div>
               <Switch
                 checked={options.generateNewAttributes}
                 onChange={(e) => setOptions(prev => ({...prev, generateNewAttributes: e.target.checked}))}
                 color="primary"
               />
             </div>

             <div className="option-item">
               <div className="option-content">
                 <Typography variant="subtitle1" className="option-label">
                   Analyze Product Images
                 </Typography>
                 <Typography variant="body2" className="option-description">
                   Extract additional details from product images
                 </Typography>
               </div>
               <Switch
                 checked={options.analyzeProductImages}
                 onChange={(e) => setOptions(prev => ({...prev, analyzeProductImages: e.target.checked}))}
                 color="primary"
               />
             </div>

             <div className="instructions-container">
               <Typography variant="subtitle1" className="option-label">
                 Additional Instructions
               </Typography>
               <Typography variant="body2" className="option-description" sx={{ mb: 2 }}>
                 Provide specific requirements or custom enhancement instructions
               </Typography>
               <TextField
                 multiline
                 rows={3}
                 variant="outlined"
                 fullWidth
                //  placeholder="Example: I want to add a fabric-type attribute"
                 value={options.additionalInstructions}
                 onChange={(e) => setOptions(prev => ({...prev, additionalInstructions: e.target.value}))}
                 className="instructions-field"
               />
             </div>
           </Box>
         </DialogContent>
         <DialogActions className="modal-actions">
           <Button onClick={handleClose} className="cancel-button">
             Cancel
           </Button>
           <Button onClick={handleConfirm} variant="contained" color="primary" className="confirm-button">
             Confirm
           </Button>
         </DialogActions>
       </Dialog>
     );
   }

   export default EnhanceOptionsModal;