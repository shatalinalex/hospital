<?php 
class Backend_Hospital_Controller extends Backend_Controller_Crud{
 protected $_listFields = ["title","id"];
 protected $_listLinks = ["doctors_id"];
 protected $_canViewObjects = ["doctor"];
} 