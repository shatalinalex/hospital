<?php return array (
  'table' => 'booking',
  'engine' => 'InnoDB',
  'connection' => 'default',
  'acl' => false,
  'parent_object' => '',
  'rev_control' => false,
  'save_history' => false,
  'link_title' => 'booking_date',
  'disable_keys' => false,
  'readonly' => false,
  'locked' => false,
  'primary_key' => 'id',
  'use_db_prefix' => true,
  'slave_connection' => 'default',
  'log_detalization' => 'default',
  'fields' => 
  array (
    'hospital_id' => 
    array (
      'type' => 'link',
      'unique' => '',
      'db_isNull' => false,
      'required' => true,
      'validator' => '',
      'link_config' => 
      array (
        'link_type' => 'object',
        'object' => 'hospital',
      ),
      'db_type' => 'bigint',
      'db_default' => false,
      'db_unsigned' => true,
    ),
    'doctor_id' => 
    array (
      'type' => 'link',
      'unique' => '',
      'db_isNull' => false,
      'required' => true,
      'validator' => '',
      'link_config' => 
      array (
        'link_type' => 'object',
        'object' => 'doctor',
      ),
      'db_type' => 'bigint',
      'db_default' => false,
      'db_unsigned' => true,
    ),
    'booking_date' => 
    array (
      'type' => '',
      'unique' => '',
      'db_isNull' => false,
      'required' => true,
      'validator' => '',
      'db_type' => 'date',
      'db_default' => false,
    ),
    'title' => 
    array (
      'type' => '',
      'unique' => '',
      'db_isNull' => false,
      'required' => true,
      'validator' => '',
      'db_type' => 'varchar',
      'db_default' => false,
      'db_len' => 255,
      'is_search' => true,
      'allow_html' => false,
    ),
  ),
  'indexes' => 
  array (
  ),
); 