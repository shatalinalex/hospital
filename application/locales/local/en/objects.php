<?php return array (
  'hospital' => 
  array (
    'title' => 'Hospital',
    'fields' => 
    array (
      'title' => 'Title',
      'doctors_id' => 'Doctors',
    ),
  ),
  'doctor' => 
  array (
    'title' => 'Doctor',
    'fields' => 
    array (
      'title' => 'Title',
    ),
  ),
  'booking' => 
  array (
    'title' => 'Booking',
    'fields' => 
    array (
      'hospital_id' => 'Hospital',
      'doctor_id' => 'Doctor',
      'booking_date' => 'Booking date',
      'title' => 'Title',
    ),
  ),
  'hospital_doctors_id_to_doctor' => 
  array (
    'title' => 'Many to many (associations table) hospital & doctor',
    'fields' => 
    array (
      'source_id' => 'SOURCE',
      'target_id' => 'TARGET',
      'order_no' => 'SORT',
    ),
  ),
); 