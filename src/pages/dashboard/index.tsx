import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';
import { AuthGuard } from '../../components/authentication/auth-guard';
import { DashboardLayout } from '../../components/dashboard/dashboard-layout';
import { OverviewBanner } from '../../components/dashboard/overview/overview-banner';
import { OverviewCryptoWallet } from '../../components/dashboard/overview/overview-crypto-wallet';
import { OverviewInbox } from '../../components/dashboard/overview/overview-inbox';
import { OverviewLatestTransactions } from '../../components/dashboard/overview/overview-latest-transactions';
import { OverviewPrivateWallet } from '../../components/dashboard/overview/overview-private-wallet';
import { OverviewTotalBalance } from '../../components/dashboard/overview/overview-total-balance';
import { OverviewTotalTransactions } from '../../components/dashboard/overview/overview-total-transactions';
import { ArrowRight as ArrowRightIcon } from '../../icons/arrow-right';
import { Briefcase as BriefcaseIcon } from '../../icons/briefcase';
import { Download as DownloadIcon } from '../../icons/download';
import { ExternalLink as ExternalLinkIcon } from '../../icons/external-link';
import { InformationCircleOutlined as InformationCircleOutlinedIcon } from '../../icons/information-circle-outlined';
import { Reports as ReportsIcon } from '../../icons/reports';
import { Users as UsersIcon } from '../../icons/users';
import { gtm } from '../../lib/gtm';

const Overview: NextPage = () => {
  const [displayBanner, setDisplayBanner] = useState<boolean>(true);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  useEffect(() => {
    // Restore the persistent state from local/session storage
    const value = globalThis.sessionStorage.getItem('dismiss-banner');

    if (value === 'true') {
      // setDisplayBanner(false);
    }
  }, []);

  const handleDismissBanner = () => {
    // Update the persistent state
    // globalThis.sessionStorage.setItem('dismiss-banner', 'true');
    setDisplayBanner(false);
  };

  return (
    <>
      <Head>
        <title>
          Dashboard: Overview | Amimed Salud
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">

        </Container>
      </Box>
    </>
  );
};

Overview.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default Overview;
