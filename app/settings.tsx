import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Body from "@/components/views/body";
import { sqliteDB } from "@/db/config";
import { mpesaMessages } from "@/db/sqlite";
import { sql } from "drizzle-orm";
import { StatusBar } from "react-native";
import { Button, Text } from "react-native-paper";

import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function Settings() {
	const statusBarHeight = StatusBar.currentHeight
	const insets = useSafeAreaInsets();
	const contentInsets = {
		top: insets.top,
		bottom: insets.bottom,
		left: 4,
		right: 4,
	};


	return ( // @ts-ignore
		<Body style={{ paddingTop: statusBarHeight }} className="items-center justify-center">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button>
						<Text>Open</Text>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent insets={contentInsets} sideOffset={2} className="w-56" align="start">
					<DropdownMenuLabel>My Account</DropdownMenuLabel>

					<DropdownMenuSeparator />

					<DropdownMenuGroup>
						<DropdownMenuItem>
							<Text>Profile</Text>
							<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Text>Billing</Text>
							<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Text>Settings</Text>
							<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Text>Keyboard shortcuts</Text>
							<DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
						</DropdownMenuItem>
					</DropdownMenuGroup>

					<DropdownMenuSeparator />

					<DropdownMenuGroup>
						<DropdownMenuItem>
							<Text>Team</Text>
						</DropdownMenuItem>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<Text>Invite users</Text>
							</DropdownMenuSubTrigger>
							<DropdownMenuSubContent>
								<DropdownMenuItem>
									<Text>Email</Text>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Text>Message</Text>
								</DropdownMenuItem>

								<DropdownMenuSeparator />

								<DropdownMenuItem>
									<Text>More...</Text>
								</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuSub>
						<DropdownMenuItem>
							<Text>New Team</Text>
							<DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
						</DropdownMenuItem>
					</DropdownMenuGroup>

					<DropdownMenuSeparator />

					<DropdownMenuItem>
						<Text>GitHub</Text>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Text>Support</Text>
					</DropdownMenuItem>
					<DropdownMenuItem disabled>
						<Text>API</Text>
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem>
						<Text>Log out</Text>
						<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>


			{/* <Button
				onPress={async () => {
					const data = await sqliteDB
						.selectDistinct({ name: mpesaMessages.counterparty })
						.from(mpesaMessages)
						.where(sql`${mpesaMessages.parsedDate} LIKE "2025-11%"`)

					console.log(
						data
					)
				}}
			>
				<Text>Get Data</Text>
			</Button> */}

		</Body>
	)
}

{/*

============TODO Options/Settings============
1. Animation Preferences
2. Theme Settings
3. Graph Settigns
	-Data Point Visibility
4. Tab View
	-Horizontal Scrollability
	-Animation Type
5. Home Screens Balance Visibility Preference

*/}