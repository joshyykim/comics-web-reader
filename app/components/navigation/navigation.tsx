"use client";
import { useState } from "react";
import { IoHome } from "react-icons/io5";
import OpenAndSave from "../buttons/open-and-save";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from '../../db/db';
import {
	FaPlusCircle,
	FaCog,
	FaRegWindowClose,
} from "react-icons/fa";
import UniversalSettings from "./settings";

async function addInitialSettings(): Promise<void> {
	db.settings.count().then(async (count: number) => {
		if (count === 0) {
			await db.settings.add({
				reversed: false,
				doublePage: false,
				darkmode: false,
				displayPerPage: 20,
			});
		}
	});
}

const Nav: React.FC = () => {
	addInitialSettings();

	const storedSetting = useLiveQuery(() => db.settings.toCollection().first());
	const isSettingsLoading = !storedSetting;

	const [showSettings, setShowSettings] = useState<Boolean>(false);

	// Debugging purpose here, to check if the settings is stored correctly.
	// As addInitialSettings create two data rows at the very first time,
	// the storedSettings will be an array of two objects.
	// But, if it's just happened in dev env, it should only check the first object in prod.
	if (storedSetting) {
		console.log(storedSetting);
	}

	return (
		<>
			<div className="flex flex-col items-center h-screen bg-black justify-start gap-4 p-1">
				<Link href="/">
					<IoHome size={30} className="fill-white" />
				</Link>
				<OpenAndSave>
					<FaPlusCircle size={30} className="fill-white" />
				</OpenAndSave>
				<FaCog
					size={30}
					className="fill-white"
					onClick={() => setShowSettings(!showSettings)}
				/>
			</div>
			{
				showSettings && !isSettingsLoading ? (
					<div className="flex flex-col items-center h-screen bg-black justify-start gap-4 p-1">
						<FaRegWindowClose
							size={30}
							className="fill-white"
							onClick={() => setShowSettings(!showSettings)}
						/>
						<UniversalSettings storedSetting={storedSetting} />
					</div>
				) : null
			}
		</>
	);
}

export default Nav;