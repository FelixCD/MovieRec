import type { ReactNode } from 'react';
import Navbar from './Navbar.tsx';
import styles from './Layout.module.css'

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default Layout;