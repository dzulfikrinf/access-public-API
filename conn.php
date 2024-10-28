<?php

$dataArray = json_decode(file_get_contents('php://input'), true);
var_dump($dataArray);die;

if (!empty($dataArray) && is_array($dataArray)) {
    $conn = connectToDatabase();
    $sql = "INSERT INTO movies (title, popularity) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);

    foreach ($dataArray as $data) {
        if (isset($data['title']) && isset($data['popularity'])) {
            $stmt->bind_param("sd", $data['title'], $data['popularity']);
            if ($stmt->execute() === TRUE) {
                echo "Film dengan judul '{$data['title']}' dan popularitas '{$data['popularity']}' berhasil disimpan.<br>";
            } else {
                echo "Error: " . $conn->error;
            }
        } else {
            echo "Struktur data tidak benar untuk elemen array:<br>";
            var_dump($data);
            echo "<br>";
        }
    }

    $stmt->close();
    $conn->close();
} else {
    echo "Data yang diterima tidak valid.";
}
?>
