"use client";
import React, { useState } from "react";
import imageCompression from "browser-image-compression";

export default function UploadForm() {
	const [userId, setUserId] = useState("");
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imageUpLoad, setImageUpload] = useState(false);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setImageFile(e.target.files[0]);
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setImageUpload(true);
		if (!userId || !imageFile) {
			alert("ユーザーIDと画像ファイルの両方を選択してください。");
			return;
		}

		const formData = new FormData();
		const options = {
			maxSizeMB: 0.01,
			useWebWorker: true,
		};
		const compressedFile = await imageCompression(imageFile, options);

		formData.append("user_id", userId);
		formData.append("image", compressedFile);

		try {
			const response = await fetch("/api/post", {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				const data = await response.json();
				console.log(data);
				alert("画像が正常にアップロードされました。");
			} else {
				alert("画像のアップロードに失敗しました。");
			}
			setImageUpload(false);
		} catch (error) {
			console.error("アップロードエラー:", error);
			alert("画像のアップロード中にエラーが発生しました。");
			setImageUpload(false);
		}
		setImageUpload(false);
	};
	return (
		<div>
			{imageUpLoad && <>ロード中</>}
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="userId">ユーザーID:</label>
					<input
						type="text"
						id="userId"
						value={userId}
						onChange={(e) => setUserId(e.target.value)}
						required
					/>
				</div>
				<div>
					<label htmlFor="image">画像ファイル:</label>
					<input
						type="file"
						id="image"
						accept="image/*"
						onChange={handleFileChange}
						required
					/>
				</div>
				<button type="submit" disabled={imageUpLoad}>
					アップロード
				</button>
			</form>
		</div>
	);
}
