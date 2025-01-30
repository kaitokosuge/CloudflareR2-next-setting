import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse, NextRequest } from "next/server";

const {
	CLOUDFLARE_ACCESS_KEY_ID,
	CLOUDFLARE_ENDPOINT,
	CLOUDFLARE_ACCESS_KEY,
	BUCKET_NAME,
} = process.env;

export async function POST(req: NextRequest) {
	const formData = await req.formData();
	const userId = formData.get("user_id");
	const image = formData.get("image") as File;

	const s3Client = new S3Client({
		region: "auto",
		endpoint: `https://${CLOUDFLARE_ENDPOINT}.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId: CLOUDFLARE_ACCESS_KEY_ID as string,
			secretAccessKey: CLOUDFLARE_ACCESS_KEY as string,
		},
	});

	const fileName = `${Date.now()}-${userId}`;
	const buffer = Buffer.from(await image.arrayBuffer());

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const uploadImage: any = {
		Bucket: BUCKET_NAME,
		Key: fileName,
		Body: buffer,
		ContentType: image.type,
		ACL: "public-read",
	};

	const command = new PutObjectCommand(uploadImage);
	await s3Client.send(command);
	const imageUrl = `${process.env.AVATAR_HOST_URL}/${fileName}`;

	return NextResponse.json(imageUrl);
}
