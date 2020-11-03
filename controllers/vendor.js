    const { v4: uuidv4 } = require('uuid');
    const ErrorResponse = require('../utils/errorResponse');
    const asyncHandler = require('../middleware/async');
    const Vendor = require('../models/vendor');

    exports.getVendors = asyncHandler(async (req, res) => {
      const vendor = await Vendor.find();
      const statues = [{key:'active', value:'Active'}, {key:'in_active', value:'In Active'}];
      const classes = [{key:'medical', value:'Medical'}, {key:'non_medical', value:'Non Medical'}];
      const subClasses = [{key:'medical_supplies', value:'Medical Supplies & Instruments', parent:"medical"}, 
      {key:'medicine', value:'Medicine', parent:"medical"},{key:'laboratory_supplies', value:'Laboratory Supplies', parent:"medical"},
      {key:'radiology_medicine', value:'Radiology Medicine & Supplies', parent:"medical"},{key:'food_beverage', value:'Food & Beverage', parent:"non_medical"},
      {key:'food_supplies', value:'Food Supplies', parent:"non_medical"},{key:'housekeeping_supplies', value:'Housekeeping Supplies', parent:"non_medical"},
      {key:'maintenance', value:'Maintenance', parent:"non_medical"},{key:'textile', value:'Textile', parent:"non_medical"},
      {key:'office_stationary_supplies', value:'Office & Stationary Supplies', parent:"non_medical"}
    ];
      

      const data = {
        vendor,
        statues,
        classes,
        subClasses
      }
      
      res.status(200).json({ success: true, data: data });
    });

    exports.addVendor = asyncHandler(async (req, res) => {
      const { englishName, arabicName, telephone1, telephone2, contactEmail, address, country, city,
        zipcode, faxno, taxno, contactPersonName, contactPersonTelephone, contactPersonEmail, paymentTerms,
        rating, status, cls, subClass } = req.body;

      const vendor = await Vendor.create({
        uuid: uuidv4(),
        vendorNo: 'WMS_'+uuidv4(),
        englishName, telephone1, telephone2, contactEmail,
        address, country, city, zipcode, faxno,
        taxno, contactPersonName, contactPersonTelephone, contactPersonEmail,
        paymentTerms, rating, status, cls, subClass,arabicName 
      });

      res.status(200).json({ success: true, data: vendor });
    });

    exports.deleteVendor = asyncHandler(async (req, res, next) => {
      const { _id } = req.params;
      const vendor = await Vendor.findById(_id);
      if(!vendor) {
        return next(
          new ErrorResponse(`Vendor not found with id of ${_id}`, 404)
        );
      }

      await Vendor.deleteOne({_id: _id});

      res.status(200).json({ success: true, data: {} });

    });

    exports.updateVendor = asyncHandler(async (req, res, next) => {
      const { _id } = req.body;

      let vendor = await Vendor.findById(_id);

      if(!vendor) {
        return next(
          new ErrorResponse(`Vendor not found with id of ${_id}`, 404)
        );
      }

      vendor = await Vendor.updateOne({_id: _id}, req.body);

      res.status(200).json({ success: true, data: vendor });
    });