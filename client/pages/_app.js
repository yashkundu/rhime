import * as React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';

import Layout from '../components/Layout';

import Snack from '../hoc/Snack';

import "../styles/globals.css";
import "../styles/connect.css";
import "../styles/notFound.css";

// Client-side cache shared for the whole session
// of the user in the browser.

const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
	const { Component, emotionCache =
		clientSideEmotionCache, pageProps } = props;

	return (
		<CacheProvider value={emotionCache}>
			<Head>
				<meta name="viewport"
					content="initial-scale=1, width=device-width" />
			</Head>
			<ThemeProvider theme={theme}>
				{/* CssBaseline kickstart an elegant,
				consistent, and simple baseline to
				build upon. */}
				<CssBaseline />


					{	(pageProps.sideBars) ? (
						<Snack Layout={Layout} Children={Component} {...pageProps}/>
						// <Snack>
						// 	<Layout {...pageProps} Children={Component} obj={obj.yup}/>
						// </Snack>
					): (
						<Snack Children={Component} {...pageProps}/>
						// <Snack>
						// 	<Component {...pageProps} />
						// </Snack>
					)}

			
			</ThemeProvider>
		</CacheProvider>
	);
}

MyApp.propTypes = {
	Component: PropTypes.elementType.isRequired,
	emotionCache: PropTypes.object,
	pageProps: PropTypes.object.isRequired,
};
















// import "../styles/globals.css";


// const App = ({Component, pageProps}) => {
// 	return (
// 		<Component {...pageProps} user={{userName: 'yashkundu', name: 'Yashasvi'}}/>
// 	);
// }

// export default App