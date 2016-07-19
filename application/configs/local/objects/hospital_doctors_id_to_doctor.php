<?php return array (
  'parent_object' => 'hospital',
  'connection' => 'default',
  'use_db_prefix' => true,
  'disable_keys' => false,
  'locked' => false,
  'readonly' => false,
  'primary_key' => 'id',
  'table' => 'hospital_doctors_id_to_doctor',
  'engine' => 'InnoDB',
  'rev_control' => false,
  'link_title' => 'id',
  'save_history' => false,
  'system' => true,
  'fields' => 
  array (
    'source_id' => 
    array (
      'type' => 'link',
      'unique' => 'source_target',
      'db_isNull' => true,
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
    'target_id' => 
    array (
      'type' => 'link',
      'unique' => 'source_target',
      'db_isNull' => true,
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
    'order_no' => 
    array (
      'db_type' => 'int',
      'db_len' => 10,
      'db_isNull' => false,
      'db_default' => 0,
      'db_unsigned' => true,
    ),
  ),
  'indexes' => 
  array (
    'source_id' => 
    array (
      'columns' => 
      array (
        0 => 'source_id',
        1 => 'target_id',
      ),
      'fulltext' => false,
      'unique' => true,
    ),
    'order_no' => 
    array (
      'columns' => 
      array (
        0 => 'order_no',
      ),
      'fulltext' => false,
      'unique' => false,
    ),
  ),
  'acl' => false,
  'slave_connection' => 'default',
); 