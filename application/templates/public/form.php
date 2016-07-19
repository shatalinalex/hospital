<?php
/**
 * Created by PhpStorm.
 * User: Александр
 * Date: 19.07.2016
 * Time: 20:06
 */

if(! defined('DVELUM'))
    exit();


$doc = $this->get('doctors');

?>
<form id="bookForm" method="post">
<table width="100%">
    <tr>
        <td width="20%" align="left">F/L name</td>
        <td width="80%" align="right"><input style="width: 200px;" type="text" value="" id="flname" name="flname"></td>
    </tr>
    <tr>
        <td width="20%" align="left">Doctor</td>
        <td width="80%" align="right"><select name="doctor" id="doctor" style="width: 200px;"><option>Select a doctor</option><?php
    if(!empty($doc))
    {
        foreach($doc as $k=>$v)
            echo '<option value="'.$k.'">'.$v.'</option>';
    }
                ?></select></td>
    </tr>
    <tr>
        <td colspan="2">
            <div id="hArea" style="margin:5px;display: none;">
                <table width="100%">
                    <tr>
                        <td width="20%" align="left">Date</td>
                        <td width="80%" align="right"><div id="datepicker"></div><input type="hidden" value="" id="actualDate" name="actualDate"></td>
                    </tr>
                    <tr>
                        <td width="20%" align="left">Hospital</td>
                        <td width="80%" align="right"><select id="hospital"  name="hospital" style="width: 200px;"><option>Select a hospital</option></select></td>
                    </tr>
                    <tr>
                        <td width="20%" align="left"></td>
                        <td width="80%" align="right"><input type="button" value="Submit" name="bookingButton"></td>
                    </tr>
                </table>
            </div>
        </td>
    </tr>
    <tr>
        <td width="20%" align="left">Booking list</td>
        <td width="80%" align="right" id="blist"></td>
    </tr>
</table>
</form>