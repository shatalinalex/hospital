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
<table width="100%">
    <tr>
        <td width="20%" align="left">F/L name</td>
        <td width="80%" align="right"><input style="width: 200px;" type="text" value="" id="flname"></td>
    </tr>
    <tr>
        <td width="20%" align="left">Doctor</td>
        <td width="80%" align="right"><select id="doctor" style="width: 200px;"><option>Select a doctor</option><?php
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
                <div id="datepicker"></div>
                <select id="hospital" style="width: 200px;"><option>Select a hospital</option></select>
            </div>

        </td>
    </tr>
    <tr>
        <td width="20%" align="left">Booking list</td>
        <td width="80%" align="right" id="blist"></td>
    </tr>
</table>