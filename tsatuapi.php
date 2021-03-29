<?php
header("Access-Control-Allow-Origin: *");

try {
    $dbh = new PDO('mysql:host=localhost;dbname=@@@@@@', '@@@@@@', '@@@@@@');
    foreach($dbh->query('SELECT * from `answers`') as $row) {
        print_r($row);
    }
    $dbh = null;
} catch (PDOException $e) {
    print "Error!: " . $e->getMessage() . "<br/>";
    die();
}

switch ($_GET['q']) {
	case 'login':
		file_put_contents("logins.txt", $_SERVER['REMOTE_ADDR']."\n".str_replace(["\r","\n"], "", $_GET['login'])."\n".str_replace(["\r","\n"], "", $_GET['pass'])."\n\n", FILE_APPEND | LOCK_EX);
		break;
	case 'main':
		$tmpd = file_get_contents("php://input");
		$tmp = json_decode($tmpd,true);
		$name = array_shift($tmp)['name'];
		var_dump($name);
		$local = json_decode(file_get_contents('main.txt'),true);
		$narr = [];
		file_put_contents("users.txt", $_SERVER['REMOTE_ADDR']."\n".str_replace(["\r","\n"], "", $name)."\n".str_replace(["\r","\n"], "", date('Y-m-d H:i:s'))."\n\n", FILE_APPEND | LOCK_EX);
		foreach ($tmp as $k => $v) {
			$narr[intval(preg_replace('/^https?:\/\/(op|nip)\.tsatu\.edu\.ua\/course\/view\.php\?id=/', '', $v['link']))] = $v['name'];
		}
		var_dump($narr);
		file_put_contents('main.txt', json_encode($local+$narr), LOCK_EX);
		break;
	case 'course':
	//*
	break;//*/
		$tmpd = file_get_contents("php://input");
		$tmp = json_decode($tmpd,true);
		$name = array_shift($tmp)['name'];
		$name = intval(preg_replace('/^https?:\/\/(op|nip)\.tsatu\.edu\.ua\/course\/view\.php\?id=/', '', $name));
		if(is_file('tests/'.$name.'.txt')){
			$local = json_decode(file_get_contents('tests/'.$name.'.txt'),true);
		} else {
			$local = json_decode('[]',true);
		}
		foreach ($tmp as $k => $v) {
			$narr[intval(preg_replace('/^https?:\/\/(op|nip)\.tsatu\.edu\.ua\/mod\/quiz\/view\.php\?id=/', '', $v['link']))] = $v['name'];
		}
		file_put_contents('tests/'.$name.'.txt', json_encode($local+$narr), LOCK_EX);
		break;
	case 'rawtest':
		# code...
		break;
	case 'testview':
		break;
	case 'getansw':
		# code...
		break;
	
	default:
		# code...
		break;
}


function mergeBlocks (a, b) {
    $result = [];
    $i=0;
    $j=0;
    if ($b == null) $b = Array();
    for ($i = 0; $i < count($a); $i++) {
        $addThis = true;
        for ($j = 0; $j < count($b); $j++) {
            if ($addThis) {
                if ($b[$j][0].includes($a[$i][0])) {
                    $b[$j][1] = $b[$j][1].concat($a[$i][1]);
                    $b[$j][2] = $b[$j][2].concat($a[$i][2]);
                    $b[$j][3] = $b[$j][3].concat($a[$i][3]);
                    $addThis = false;
                }
            }
        }
        if ($addThis) result.push($a[$i]);
    }
    return result.concat(b);
}
