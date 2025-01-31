import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: '/login',
      permanent: true, // Set to true if the redirect is permanent
    },
  };
};

export default function Home() {
  return null; // Render nothing
}