import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { GetServerSidePropsContext } from 'next';

export async function requireAuth(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  return { props: { session } };
}

export async function requireRole(context: GetServerSidePropsContext, roles: string[]) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || !roles.includes(session.user.role)) {
    return {
      redirect: {
        destination: '/unauthorized',
        permanent: false,
      },
    };
  }

  return { props: { session } };
} 