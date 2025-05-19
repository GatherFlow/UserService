import { defineRelations } from 'drizzle-orm'
import * as schema from './schema/index.js'

export const relations = defineRelations(schema, (r) => ({
	authProviderTable: {
		user: r.one.userTable({
			from: r.authProviderTable.userId,
			to: r.userTable.id,
			optional: false,
		}),
	},
	userTable: {
		language: r.one.userLanguageTable({
			from: r.userTable.id,
			to: r.userLanguageTable.userId,
			optional: false,
		}),
		privacy: r.one.userPrivacyTable({
			from: r.userTable.id,
			to: r.userPrivacyTable.userId,
			optional: false,
		}),
		socialLinks: r.many.userSocialLinkTable(),
		providers: r.many.authProviderTable(),
		credentials: r.one.internalCredentialTable({
			from: r.userTable.id,
			to: r.internalCredentialTable.userId,
			optional: false,
		}),
	},
	userSocialLinkTable: {
		user: r.one.userTable({
			from: r.userSocialLinkTable.userId,
			to: r.userTable.id,
			optional: false,
		}),
	},
}))
