<?php
/**
 * Created by PhpStorm.
 * User: Александр
 * Date: 19.07.2016
 * Time: 21:23
 */

class Model_Booking extends Model{
    public function checkDate($doctorId,$date){
        $data = $this->getList(false,array(
            new Db_Select_Filter('booking_date',$date,Db_Select_Filter::EQ),
            new Db_Select_Filter('doctor_id',$doctorId,Db_Select_Filter::EQ)
        ),array('id'),true);
        if(empty($data))
            return false;
        else
            return true;
    }
}