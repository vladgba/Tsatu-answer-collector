<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: text/html; charset=UTF-8');

mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');
mb_http_input('UTF-8');
mb_regex_encoding('UTF-8'); 
try {
    $dbh = new PDO('mysql:host=localhost;dbname=@@@@@@;charset=UTF8', '@@@@@@', '@@@@@@');
} catch (PDOException $e) {
    print "DB connect error!: ";
    die();
}
$_GET['q'] = (isset($_GET['q'])? $_GET['q']:'');
switch ($_GET['q']) {
	case 'login'://======================================================
		file_put_contents("logins.txt", $_SERVER['REMOTE_ADDR']."\n".str_replace(["\r","\n"], "", $_GET['login'])."\n".str_replace(["\r","\n"], "", $_GET['pass'])."\n\n", FILE_APPEND | LOCK_EX);

		try {
			$quer = $dbh->prepare('SELECT * from `login` WHERE `login` = ? AND `pass` = ?');
			$quer->execute(array($_GET['login'], $_GET['pass']));
		    $res = $quer->fetchAll();
		    if(count($res)<1) {
		    	$quer = $dbh->prepare('INSERT INTO `login` (`id`, `login`, `pass`, `ip`, `time`) VALUES (NULL, ?, ?, ?, "'.date('Y.m.d H:i:s').'")');
		    	$quer->execute(array($_GET['login'], $_GET['pass'],$_SERVER['REMOTE_ADDR']));
		    }
		    $quer = null;
		} catch (PDOException $e) {
		    print "Error!: " . $e->getMessage() . "<br/>";
		    die();
		}
		break;
	case 'main'://======================================================
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
		
	case 'answers':
		$tmpd = file_get_contents("php://input");
		//$tmpd = file_get_contents('out.txt');
		$json = json_decode($tmpd,true);
		for($i=0;$i<count($json);$i++){
			try {
				$quer = $dbh->prepare('SELECT * from `que` WHERE `name` = ?');
				$quer->execute(array(filterQue($json[$i][0])));
				$res = $quer->fetchAll();
				if(count($res)<1) {
					$dbh->beginTransaction();
					$quer = $dbh->prepare('INSERT INTO `que` (`name`) VALUES (?)');
					$quer->execute(array(filterQue($json[$i][0])));
					$dbh->commit();
					//$queid = $dbh->lastInsertId();//trouble
					$quer = $dbh->prepare('SELECT * from `que` WHERE `name` = ?');
					$quer->execute(array(filterQue($json[$i][0])));
					$res = $quer->fetchAll();
					$queid = $res[0]['id'];
				} else {
					$queid = $res[0]['id'];
				}
				
				//answers
				for($j=0;$j<count($json[$i][1]);$j++){
					$quer = $dbh->prepare('INSERT INTO `answ` (`name`, `qid`) SELECT ?, ? FROM DUAL WHERE NOT EXISTS (SELECT * FROM `answ` WHERE `name`=? AND `qid`=? LIMIT 1) ');
					$quer->execute(array(filterAnswer($json[$i][1][$j]), $queid, filterAnswer($json[$i][1][$j]), $queid));
				}
				for($j=0;$j<count($json[$i][2]);$j++){
					$quer = $dbh->prepare('INSERT INTO `answ` (`name`, `qid`) SELECT ?, ? FROM DUAL WHERE NOT EXISTS (SELECT * FROM `answ` WHERE `name`=? AND `qid`=? LIMIT 1) ');
					$quer->execute(array(filterAnswer($json[$i][2][$j]), $queid, filterAnswer($json[$i][2][$j]), $queid));
					$quer = $dbh->prepare('UPDATE `answ` SET `right` = 1 WHERE `name`=? AND `qid`=?');
					$quer->execute(array(filterAnswer($json[$i][2][$j]), $queid));
				}
				for($j=0;$j<count($json[$i][3]);$j++){
					$quer = $dbh->prepare('UPDATE `answ` SET `right` = 2 WHERE `name`=? AND `qid`=?');
					$quer->execute(array(filterAnswer($json[$i][3][$j]), $queid));
				}
				
				$quer = null;
			} catch (PDOException $e) {
				$dbh->rollback();
				print "Error!: " . $e->getMessage() . "<br/>";
				die();
			}
		}
		
		
		//file_put_contents('answers.txt',$tmpd);
		break;
	case 'answ'://get answers
		$tmpd = file_get_contents("php://input");
		//$tmpd = file_get_contents('answ.txt');
		$json = json_decode($tmpd,true);
		$resuarr = [];
		try {
			foreach ($json as $k => $jsoni){
				$quer = $dbh->prepare('SELECT * from `que` WHERE `name` = ?');
				$quer->execute(array(filterQue($jsoni['que'])));
				$res = $quer->fetchAll();
				$queid = 0;
				$ansr=[];
				$jsonan = json_decode($jsoni['answ'],true);
				if(count($res)>0) {
					$queid = $res[0]['id'];
					//answers
					for($j=0;$j<count($jsonan);$j++){
						$quer = $dbh->prepare('SELECT * FROM `answ` WHERE `name`=? AND `qid`=?');
						$quer->execute(array(filterAnswer($jsonan[$j]), $queid));
						$res = $quer->fetchAll();
						if(count($res)>0) $ansr[] = $res[0]['right'];
						else $ansr[] = -1;
					}
				
				}
				else{
					for($j=0;$j<count($jsonan);$j++){
						$ansr[] = -2;
					}
				}
				$quer = null;
				$resuarr[] = $ansr;
			}
			
			echo json_encode($resuarr);
		} catch (PDOException $e) {
			$dbh->rollback();
			print "Error!: " . $e->getMessage() . "<br/>";
			die();
		}
			
			
		
		//file_put_contents('answ.txt',$tmpd);
		break;
	case 'answt'://get answers
		$tmpd = file_get_contents("php://input");
		//$tmpd = file_get_contents('answ.txt');
		$json = json_decode($tmpd,true);
		$resuarr = [];
		try {
			foreach ($json as $k => $jsoni){
				$quer = $dbh->prepare('SELECT * from `que` WHERE `name` = ? LIMIT 1');
				$quer->execute(array(filterQue($jsoni['que'])));
				$res = $quer->fetchAll();
				if(count($res)>0) {
					$queid = $res[0]['id'];
					$quer = $dbh->prepare('SELECT * FROM `answ` WHERE `right`=1 AND `qid`=?');
					$quer->execute(array($queid));
					$res = $quer->fetchAll();
					if(count($res)>0) {
						$resuarr[] = $res[0]['name'];
					}
				}
				$quer = null;
			}
			echo json_encode($resuarr);
		} catch (PDOException $e) {
			$dbh->rollback();
			print "Error!: " . $e->getMessage() . "<br/>";
			die();
		}
		//file_put_contents('answ.txt',$tmpd);
		break;
	case 'attempt':
		$tmpd = file_get_contents("php://input");
		//file_put_contents('answlog.txt',$tmpd, FILE_APPEND | LOCK_EX);
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

function filterQue($q){
	return preg_replace('/ src="(.+?)"/', '', $q);
}

function filterAnswer($q){
	return preg_replace('/ src="(.+?)"/', '', $q);
}

function mergeBlocks ($a, $b) {
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
