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
        $docData = $docModel->getList(false,false,array('id','title'),true);
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
        ),array('booking_date','title','hospital_id'),true);

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
            ),array('id','title'),true);
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

    public function hospitalAction(){
        $dId = Request::post('did','integer',false);

        if(!$dId)
            Response::jsonError('empty');

        //получаем больницы где работает доктор
        $hospital_doctors_id_to_doctorModel = Model::factory('hospital_doctors_id_to_doctor');
        $data = $hospital_doctors_id_to_doctorModel->getList(false,array(
            new Db_Select_Filter('target_id',$dId,Db_Select_Filter::EQ)
        ),array('source_id'),true);

        if(empty($data))
            Response::jsonError('empty');

        $hId = Utils::fetchCol('source_id',$data);
        $hId = array_unique($hId);

        $modelHospital = Model::factory('hospital');
        $data = $modelHospital->getList(false,array(
            new Db_Select_Filter('id',$hId,Db_Select_Filter::IN),
        ),array('id','title'),true);

        Response::jsonSuccess($data);

    }

    public function saveAction(){
        $flname = Request::post('flname','string',false);
        $doctor = Request::post('doctor','integer',false);
        $actualDate = Request::post('actualDate','string',false);
        $hospital = Request::post('hospital','integer',false);

        if(empty($flname))
            Response::jsonError('Enter name','flname');
        if(empty($doctor))
            Response::jsonError('Select doctor','$doctor');
        if(empty($actualDate))
            Response::jsonError('Select date','actualDate');
        if(empty($hospital))
            Response::jsonError('Select hospital','hospital');

        //дата свободна?
        if(Model::factory('booking')->checkDate($doctor,$actualDate))
            Response::jsonError('Busy on this date','actualDate');

        //получаем больницы где работает доктор
        $hospital_doctors_id_to_doctorModel = Model::factory('hospital_doctors_id_to_doctor');
        $data = $hospital_doctors_id_to_doctorModel->getList(false,array(
            new Db_Select_Filter('target_id',$doctor,Db_Select_Filter::EQ),
            new Db_Select_Filter('source_id',$hospital,Db_Select_Filter::EQ)
        ),array('source_id'),true);

        if(empty($data))
            Response::jsonError('Wrong hospital','hospital');

       try{
            $object = new Db_Object('booking');
           $object->set('booking_date',$actualDate);
           $object->set('doctor_id',$doctor);
           $object->set('hospital_id',$hospital);
           $object->set('title',$flname);
           $object->save();
       }catch (Exception $e)
       {
           Response::jsonError('save error');
       }

        Response::jsonSuccess();
    }
}