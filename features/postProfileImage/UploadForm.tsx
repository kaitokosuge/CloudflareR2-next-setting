"use client";
import React, { useState } from "react";

export default function UploadForm() {
	const [userId, setUserId] = useState("");
	const [imageFile, setImageFile] = useState<File | null>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setImageFile(e.target.files[0]);
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!userId || !imageFile) {
			alert("ユーザーIDと画像ファイルの両方を選択してください。");
			return;
		}

		const formData = new FormData();
		formData.append("user_id", userId);
		formData.append("image", imageFile);

		try {
			const response = await fetch("/api/post", {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				alert("画像が正常にアップロードされました。");
			} else {
				alert("画像のアップロードに失敗しました。");
			}
		} catch (error) {
			console.error("アップロードエラー:", error);
			alert("画像のアップロード中にエラーが発生しました。");
		}
	};
	return (
		<div>
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
				<button type="submit">アップロード</button>
			</form>
		</div>
	);
}
