import Body from '@/components/views/body';
import { sqliteDB } from '@/db/config';
import { categoriesTable } from '@/db/sqlite';
import { useEffect } from 'react';
export default function ReusableAccordion() {

	useEffect(() => {
		sqliteDB
			.select()
			.from(categoriesTable)

			.then(console.log)

	}, [])


	return (
		<Body>
		</Body>
	)
}