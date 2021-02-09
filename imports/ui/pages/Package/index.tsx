import { Meteor } from 'meteor/meteor';
import React, { useEffect } from 'react';
import { Terminal, Exclamation } from 'heroicons-react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai as codeStyles } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useParams } from 'react-router-dom';
import ago from 's-ago';

import { QPackageInfo } from '../../../../client/api/LatestPackages';
import useQuery from '../../hooks/useStaticQuery';
import Header from '../../components/Header';
import Page from '../../components/Page';

const renderers = {
  code: ({ language, value }: { language: string, value: string }) => {
    const languages = [
      'ts',
      'typescript',
      'js',
      'javascript',
    ];
    return <SyntaxHighlighter style={codeStyles} language={language} showLineNumbers={languages.includes(language)} children={value} />;
  },
};

const PackagePage = (): JSX.Element => {
  const { username, packagename } = useParams<{ username: string, packagename: string }>();
  const { data, refetch } = useQuery({ query: QPackageInfo, params: { username, packageName: packagename } });
  const pkg = data[0];

  useEffect(() => {
    Meteor.call('updateExternalPackageData', `${username !== 'meteor' ? `${username}:` : ''}${packagename}`,
      (error: Meteor.Error, result: boolean) => {
        if (typeof error === 'undefined') {
          if (result) {
            console.log('refetching');
            refetch();
          }
        }
      },
    );
  }, []);

  return (
    <>
      <Header />
      <Page>
        {typeof pkg !== 'undefined'
          ? <>
            <section className="flex flex-col space-y-6  pb-3">
              <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-semibold">{pkg.packageName}</h1>
                <p className="text-sm flex space-x-2">
                  <span className="text-blueGray-400">
                    v{pkg.version}
                  </span>
                  <span>&bull;</span>
                  <span className="text-blueGray-400">
                    Published {ago(pkg.published)}
                  </span>
                </p>
              </div>
              <p>{pkg.description}</p>
            </section>

            <section className="grid gap-10 grid-cols-1 lg:grid-cols-4">
              <aside className="flex flex-col lg:col-start-4 lg:order-2">
                <h3 className="text-yellow-500 text-lg mb-4">Installation</h3>
                <div className="flex items-center border-blueGray-600 border px-4 py-2 overflow-hidden whitespace-pre rounded-md space-x-4">
                  <Terminal size={22} className="flex-none" />
                  <code className="select-all">
                    meteor add {pkg.packageName}
                  </code>
                </div>
              </aside>
              {typeof pkg.readme !== 'undefined'
                ? <article className="markdown-body bg-blueGray-700 rounded-md px-5 py-7 lg:col-end-4 lg:col-start-1 lg:order-1">
                  { typeof pkg.readme.fullText !== 'undefined'
                    ? <ReactMarkdown skipHtml plugins={[gfm]} renderers={renderers} children={`${pkg.readme?.fullText ?? ''}`} />
                    : <p className="text-2xl text-center">Loading...</p>
                  }
                </article>
                : <div className="flex flex-col items-center space-y-10 flex-auto text-center py-10 bg-blueGray-600 rounded-md">
                  <h1 className="text-2xl font-bold">No Documentation</h1>
                  <Exclamation size={40} className="text-yellow-500"/>
                  <p>This package does not contain a README file.</p>
                </div>
              }

            </section>
          </>
          : null
        }
      </Page>
    </>
  );
};

export default PackagePage;
