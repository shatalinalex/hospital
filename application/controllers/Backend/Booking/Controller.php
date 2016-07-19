<?php 
class Backend_Booking_Controller extends Backend_Controller_Crud{
 protected $_listFields = ["hospital_id","doctor_id","booking_date","title","id"];
 protected $_listLinks = ["hospital_id","doctor_id"];
 protected $_canViewObjects = ["hospital","doctor"];
} 