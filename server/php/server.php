<?php
chdir("../..");

function randomString($length = 10, $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}
if (file_exists("config.json")) {
    $config = json_decode(file_get_contents("config.json"));
    if ($config->server == "server/php/server.php") {
        if (!file_exists("pastes")) {
            mkdir("pastes");
            file_put_contents("pastes/.htaccess", "Deny from all");
        }


        if (isset($_POST["contents"])) {
            $pasteUrl = randomString(6);
            while (file_exists("pastes/".$pasteUrl.".paste"))
                $pasteUrl = randomString(6);
            
            file_put_contents("pastes/".$pasteUrl.".paste", json_encode([
                "content"=>$_POST["contents"]
            ]));
            echo json_encode([
                "success"=>true,
                "url"=>$pasteUrl
            ]);
        } else if (isset($_GET["paste"]) && strpos($_GET["paste"], "..") === false) {
            if (file_exists("pastes/".$_GET["paste"].".paste")) {
                echo file_get_contents("pastes/".$_GET["paste"].".paste");
            } else
                echo "{\"error\": \"Not Found\"}";
        } else
            echo "{\"error\": \"Method Not Found\"}";
    }
} else
    echo "{\"error\": \"Config Not Found\"}";