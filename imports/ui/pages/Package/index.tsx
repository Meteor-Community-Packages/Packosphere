import { Meteor } from 'meteor/meteor';
import React, { useEffect } from 'react';
import { Terminal, Exclamation, ExternalLinkOutline, Scale } from 'heroicons-react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai as codeStyles } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useParams } from 'react-router-dom';
import ago from 's-ago';
import slug from 'slug';

import { QPackageInfo } from '../../../../client/api/LatestPackages';
import useQuery from '../../hooks/useStaticQuery';
import Header from '../../components/Header';
import Page from '../../components/Page';
import { getAgeInYears } from '../../../utils';

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
  heading: ({ level, children, node }: {level: number, children: any, node: any}) => {
    const Heading = `h${level}` as keyof JSX.IntrinsicElements;
    return <Heading id={slug(node.children[0].value)} children={children} />;
  },
};

const PackagePage = (): JSX.Element => {
  const { username, packagename } = useParams<{ username: string, packagename: string }>();
  const { data, refetch } = useQuery({ query: QPackageInfo, params: { username, packageName: packagename } });
  const pkg = data[0];
  const age = getAgeInYears(pkg?.published);
  const old = age >= 3;

  let publishedIndicator: string;

  switch (age) {
    case 0:
    case 1:
      publishedIndicator = 'text-blueGray-400';
      break;
    case 2:
      publishedIndicator = 'text-yellow-300';
      break;
    case 3:
      publishedIndicator = 'text-yellow-600 animate-pulse';
      break;
    default:
      publishedIndicator = 'text-red-600 animate-pulse';
      break;
  }

  useEffect(() => {
    Meteor.call('updateExternalPackageData', `${username !== 'meteor' ? `${username}:` : ''}${packagename}`,
      (error: Meteor.Error, result: boolean) => {
        if (typeof error === 'undefined') {
          if (result) {
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
                <p className="flex space-x-2">
                  <span className="text-blueGray-400">
                    v{pkg.version}
                  </span>
                  <span>&bull;</span>
                  <span className={publishedIndicator}>
                    Published {ago(pkg.published)}
                  </span>
                </p>
              </div>
              {old && <p className="font-bold text-red-600 text-lg italic">
                This package has not had recent updates. Please investigate it's current state before
                committing to using it in your project.
              </p>}
              <p className="text-lg">{pkg.description}</p>
            </section>

            <section className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 xl:gap-6 items-start">
              <aside className="flex flex-col space-y-6 lg:order-2 xl:col-span-1">
                <div>
                  <h3 className="text-yellow-500 text-lg mb-4">Installation</h3>
                  <div className="flex items-center border-blueGray-600 border px-4 py-2 overflow-hidden whitespace-pre rounded-md space-x-4">
                    <Terminal size={22} className="flex-none" />
                    <code className="select-all">
                    meteor add {pkg.packageName}
                    </code>
                  </div>
                </div>
                {pkg.meta.repoInfo !== null && typeof pkg.meta.repoInfo !== 'undefined' &&
                  <div className="flex flex-col space-y-4">
                    <div>
                      <h3 className="flex items-center justify-between text-yellow-500 text-lg mb-4">
                        <span>Repo</span>
                        <span className="text-xs text-blueGray-400">Updated {ago(new Date(pkg.meta.repoInfo.updated_at))}</span>
                      </h3>
                      <a href={pkg.git} target="_blank" className="flex items-center border-blueGray-600 border px-4 py-2 overflow-hidden whitespace-pre rounded-md space-x-4">
                        <ExternalLinkOutline size={22} className="flex-none" />
                        <span>{pkg.git}</span>
                      </a>
                    </div>
                    {pkg.meta.repoInfo?.fork &&
                      <span className="italic text-red-600">This package is possibly a fork</span>
                    }
                    <div className="flex items-center space-x-6 text-center lg:space-x-4">
                      <a href={`${pkg.meta.repoInfo.html_url}/issues`} target="_blank" className="flex items-center space-x-2 font-bold">
                        <span>{pkg.meta.repoInfo.open_issues} issues</span>
                      </a>
                      <a href={`${pkg.meta.repoInfo.html_url}/stargazers`} target="_blank" className="flex items-center space-x-2 font-bold">
                        <span>{pkg.meta.repoInfo.stargazers_count} stars</span>
                      </a>
                      <a href={`${pkg.meta.repoInfo.html_url}/network/members`} target="_blank" className="flex items-center space-x-2 font-bold">
                        <span>{pkg.meta.repoInfo.forks_count} forks</span>
                      </a>
                      <a href={`${pkg.meta.repoInfo.html_url}/watchers`} target="_blank" className="flex items-center space-x-2 font-bold">
                        <span>{pkg.meta.repoInfo.watchers_count} watchers</span>
                      </a>
                    </div>
                    <div className="flex space-x-6 items-center">
                      <span className="flex w-7 h-7 bg-white items-end justify-end rounded-sm">
                        <span className="text-blueGray-800 font-extrabold text-xl font-mono -mb-1">
                          {pkg.meta.repoInfo.language === 'TypeScript' ? 'TS' : 'JS'}
                        </span>
                      </span>
                      <p className="flex items-center space-x-2">
                        <Scale size={25} className="inline-block" /><span className="font-bold">{pkg.meta.repoInfo.license?.spdx_id ?? 'No License'}</span>
                      </p>
                    </div>
                  </div>
                }

              </aside>
              <article className="lg:order-1 xl:col-span-3">
                {typeof pkg.readme !== 'undefined'
                  ? <div className="markdown-body bg-blueGray-700 rounded-md px-5 py-7">
                    {typeof pkg.readme.fullText !== 'undefined'
                      ? <ReactMarkdown skipHtml plugins={[gfm]} renderers={renderers} children={`${pkg.readme?.fullText ?? ''}`} />
                      : <p className="text-2xl text-center">Loading...</p>
                    }
                  </div>
                  : <div className="flex flex-col items-center space-y-10 flex-auto text-center py-10 bg-blueGray-600 rounded-md">
                    <h1 className="text-2xl font-bold">No Documentation</h1>
                    <Exclamation size={40} className="text-yellow-500"/>
                    <p>This package does not contain a README file.</p>
                  </div>
                }
              </article>
            </section>
          </>
          : null
        }
      </Page>
    </>
  );
};

export default PackagePage;
