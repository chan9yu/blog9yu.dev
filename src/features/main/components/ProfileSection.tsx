import Image from "next/image";

import { Card, CardContent } from "@/shared/components/ui/Card";

export default function ProfileSection() {
	return (
		<Card>
			<CardContent className="pt-6">
				<div className="space-y-4">
					<div className="flex justify-center">
						<div className="bg-muted rounded-full p-2">
							<div className="h-36 w-36 overflow-hidden rounded-full">
								<Image
									src="https://avatars.githubusercontent.com/u/80776262?v=4"
									alt="chan9yu"
									width={144}
									height={144}
									className="object-cover"
								/>
							</div>
						</div>
					</div>

					<div className="text-center">
						<h3 className="text-lg font-bold">chan9yu</h3>
						<p className="text-primary text-sm">Front-end Developer</p>
					</div>

					<p className="bg-primary/10 rounded p-2 text-center text-sm">프론트엔드 개발자 ✨</p>
				</div>
			</CardContent>
		</Card>
	);
}
