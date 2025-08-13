//controller/vendorController.js

import {addVendor, vendorList, editVendor} from '../models/vendorModel.js'

export const createVendor = async (req, res) =>{
  console.log(req.body); // Log the request body to see what is being sent
    const {vendorName, email, phone, address }= req.body

    try {
        // Directly use the password without hashing
        const result = await addVendor([
          vendorName,
          email,
          phone,
          address
        ]);
        res
          .status(201)
          .json({ message: 'Vendor added successfully!', id: result.insertId });
      } catch (error) {
        console.error('error inserting vendor :', error.message || error);
        res.status(500).json({ error: 'An error occurred while adding the vendor.' });
      }
}

export const getVendors = async (req, res) => {
  try {
    // console.log('Fetching vendors...');
    const vendors = await vendorList([]);
    res.status(200).json(vendors);
    // console.log('Vendors fetched:', vendors);
    // res.json(vendors);
  } catch (error) {
    console.error('Error retrieving vendors:', error);
    res.status(500).json({ error: 'Failed to retrieve vendors' });
  }
};


// update vendor 
// export const updateVendor = async (req, res) => {
//   console.log("req.params:", req.params);
//   const { id } = req.params;
//   const {  name, email, phone, address} = req.body;
//   console.log("Updating vendor with data:", { id, name, email, phone, address});

//   try {
//     const result = await editVendor(id, { name, email, phone, address});
//     res.json({ message: 'vendor updated successfully', result });
//   } catch (error) {
//     console.error('Error updating vendor:', error);
//     res.status(500).json({ error: 'Failed to update vendor' });
//   }
// };

export const updateVendor = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;

  try {
    const result = await editVendor(id, { name, email, phone, address });

    if (result.affectedRows > 0) {
      res.json({ message: 'Vendor updated successfully' });
    } else {
      res.status(404).json({ error: 'Vendor not found' });
    }
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(500).json({ error: 'Failed to update vendor' });
  }
};
