<?php
/**
 * Created by PhpStorm.
 * User: Александр
 * Date: 19.07.2016
 * Time: 19:57
 */

class Frontend_Booking_Controller extends Frontend_Controller
{

    public function indexAction()
    {
        $this->includeScripts();

        $template = new Template();

        //doctorlist
        $docModel = Model::factory('doctor');
        $docData = $docModel->getList(false,false,array('id','title'));
        if(!empty($docData))
            $docData = Utils::collectData('id','title',$docData);
        $template->doctors = $docData;
        $this->_page->text = $template->render('/public/form.php');
    }

    protected function includeScripts(){

        $this->_resource->addCss('/js/lib/ui/jquery-ui.css');

        $this->_resource->addJs('/js/lib/ui/external/jquery/jquery.js',10, true , 'head');
        $this->_resource->addJs('/js/lib/ui/jquery-ui.js',20 , true , 'head');
        $this->_resource->addJs('/js/app/frontend/booking.js',30 , true , 'head');
    }

    /**
     * запись к достору
     */
    public function loadlistAction(){
        $dId = Request::post('did','integer',false);
        if(!$dId)
            Response::jsonError('empty');

        //лента записи к доктору на сегодня и последующие дни
        $modelBooking = Model::factory('booking');
        $bookingData = $modelBooking->getList(false,array(
            new Db_Select_Filter('booking_date',date('Y-m-d'),Db_Select_Filter::GT),
            new Db_Select_Filter('doctor_id',$dId,Db_Select_Filter::EQ)
        ),array('booking_date','title','hospital_id'));

        if(empty($bookingData))
            Response::jsonSuccess(array());

        $hIds = Utils::fetchCol('hospital_id',$bookingData);
        if(!empty($hIds))
        {
            $hIds = array_unique($hIds);
            //больницы где принимает этот доктор
            $modelHospital = Model::factory('hospital');
            $hospitalData = $modelHospital->getList(false,array(
                new Db_Select_Filter('id',$hIds,Db_Select_Filter::IN),
            ),array('id','title'));
            if(!empty($hospitalData))
                $hospitalData = Utils::collectData('id','title',$hospitalData);

        }

        foreach($bookingData as &$v)
            $v['hospital_id'] = isset($hospitalData[$v['hospital_id']])?$hospitalData[$v['hospital_id']]:'';

        Response::jsonSuccess($bookingData);
    }

    public function checkAction(){
        $dId = Request::post('did','integer',false);
        $bDate = Request::post('date','string',false);

        if(!$dId || !$bDate)
            Response::jsonError('error');

        Response::jsonSuccess(
            array(),
            array(
                'state'=>Model::factory('booking')->checkDate($dId,$bDate)
            )
        );
    }
}