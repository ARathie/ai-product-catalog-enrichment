   // frontend/src/components/EnhanceOptionsModal.jsx
   import React from 'react';
   import {
     Dialog,
     DialogTitle,
     DialogContent,
     DialogActions,
     Button,
     FormControlLabel,
     Switch,
     TextField
   } from '@mui/material';

   function EnhanceOptionsModal({
     open,
     handleClose,
     options,
     setOptions,
     handleConfirm
   }) {
     const handleToggleChange = (e) => {
       const { name, checked } = e.target;
       setOptions((prev) => ({
         ...prev,
         [name]: checked
       }));
     };

     const handleInputChange = (e) => {
       const { name, value } = e.target;
       setOptions((prev) => ({
         ...prev,
         [name]: value
       }));
     };

     const onConfirm = () => {
       handleConfirm();
     };

     return (
       <Dialog open={open} onClose={handleClose}>
         <DialogTitle>Enhancement Options</DialogTitle>
         <DialogContent>
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
             <FormControlLabel
               control={
                 <Switch
                   checked={options.fillInDataGaps}
                   onChange={handleToggleChange}
                   name="fillInDataGaps"
                   color="primary"
                 />
               }
               label="Fill in Data Gaps"
             />
             <FormControlLabel
               control={
                 <Switch
                   checked={options.fixCategories}
                   onChange={handleToggleChange}
                   name="fixCategories"
                   color="primary"
                 />
               }
               label="Fix Categories"
             />
             <FormControlLabel
               control={
                 <Switch
                   checked={options.generateNewAttributes}
                   onChange={handleToggleChange}
                   name="generateNewAttributes"
                   color="primary"
                 />
               }
               label="Generate New Attributes"
             />
             <FormControlLabel
               control={
                 <Switch
                   checked={options.analyzeProductImages}
                   onChange={handleToggleChange}
                   name="analyzeProductImages"
                   color="primary"
                 />
               }
               label="Analyze Product Images for Generation"
             />
             <TextField
               name="additionalInstructions"
               label="Additional Prompting Instructions (Optional)"
               multiline
               rows={4}
               variant="outlined"
               fullWidth
               margin="normal"
               value={options.additionalInstructions}
               onChange={handleInputChange}
             />
           </div>
         </DialogContent>
         <DialogActions>
           <Button onClick={handleClose} color="secondary">
             Cancel
           </Button>
           <Button onClick={onConfirm} color="primary" variant="contained">
             Confirm
           </Button>
         </DialogActions>
       </Dialog>
     );
   }

   export default EnhanceOptionsModal;