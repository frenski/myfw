<?php

require 'php-sdk/src/facebook.php';

$context = $_GET['d'];
$width = $_GET['w'];
$height = $_GET['h'];
if($context == '2'){
  $dst_width = 800;
  $dst_height = 600;
}else{
  $dst_width = $width;
  $dst_height = $height;
}

//Facebook login
$facebook = new Facebook(array(
  'appId'  => '173394062703226',
  'secret' => 'f46050f0aa42aaec1a5d9aa6fb12ee64',
));

$user = $facebook->getUser();
$user_profile = $facebook->api('/me');

if(!$user){
  echo "No connecition to Facebook!";
}else{
  if (isset($GLOBALS["HTTP_RAW_POST_DATA"])){
    // Get the data
    $image_data=$GLOBALS['HTTP_RAW_POST_DATA'];
    $filter_data=substr($image_data, strpos($image_data, ",")+1);
    $decoded_data=base64_decode($filter_data);

    // Save file.
    $fp = fopen( 'files/'.$user_profile['id'].'_'.$context.'d.png', 'wb' );
    fwrite( $fp, $decoded_data);
    fclose( $fp );
    
    if($context == '2'){
      //merges the lines file with the map
      $map_image = imagecreatefromjpeg('images/themap1.jpg');
      $lines_image = imagecreatefrompng('files/'.$user_profile['id'].'_'.$context.'d.png');
      imagesavealpha($lines_image, false);
      imagealphablending($lines_image, false);
      imagecopy($map_image, $lines_image, 0, 0, 0, 0, $width, $height);
    
      //Adds text
      $purple = imagecolorallocate($map_image, 141, 0, 198);
      $darkgray = imagecolorallocate($map_image, 132, 132, 132);
      $lightgray = imagecolorallocate($map_image, 201, 201, 201);
      $black = imagecolorallocate($map_image, 50, 50, 50);
      $text1 = strtoupper($user_profile['name']);
      $text2 = $_GET['text2'];
      $font1 = 'css/League-Gothic.otf';
      $font2 = 'css/arial.ttf';
      $fontsize1 = 20;
      $fontsize2 = 10;
      // imagettftext($map_image, $fontsize1, 0, 399, 469, $darkgray, $font1, $text1);
      // imagettftext($map_image, $fontsize1, 0, 401, 471, $lightgray, $font1, $text1);
      // imagettftext($map_image, $fontsize1, 0, 400, 470, $purple, $font1, $text1);
      // imagettftext($map_image, $fontsize2, 0, 401, 486, $lightgray, $font2, $text2);
      // imagettftext($map_image, $fontsize2, 0, 400, 485, $black, $font2, $text2);
    
      imagepng($map_image, 'files/'.$user_profile['id'].'_'.$context.'d.png',9);
    }
    
    //uploads the image to Facebook
    $file_path = 'files/'.$user_profile['id'].'_'.$context.'d.png';
    $facebook->setFileUploadSupport(true);
    $args = array('message' => 'A world of friends');
    $args['image'] = '@' . realpath($file_path);
    $data = $facebook->api('/me/photos', 'POST', $args);
    
    if($data){
      echo "Post was successful!<br/>Check your profile";
    }else{
      echo "Unable to upload image";
    }
  }else{
    echo "No image to upload!";
  }
}

?>