import { SvelteKitAuth } from '@auth/sveltekit'
import Google from '@auth/sveltekit/providers/google'

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [Google],
	callbacks: {
		async session({ session, token }) {
			if (!session.user.sub) session.user.sub = token.sub

			return session
		}
	}
})
