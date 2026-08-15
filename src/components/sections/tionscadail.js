import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { usePrefersReducedMotion } from '@hooks';
import FeaturedGrid from './featuredGrid';

const StyledTionscadailSection = styled.section`
  .tionscadail-intro {
    max-width: 700px;
    margin: -20px 0 60px;
    color: var(--slate);
    font-size: var(--fz-lg);

    @media (max-width: 768px) {
      margin: -10px 0 40px;
    }
  }
`;

const Tionscadail = () => {
  const data = useStaticQuery(graphql`
    {
      tionscadail: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/tionscadail/" } }
        sort: { fields: [frontmatter___date], order: ASC }
      ) {
        edges {
          node {
            frontmatter {
              title
              cover {
                childImageSharp {
                  gatsbyImageData(width: 700, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
                }
              }
              tech
              github
              external
              cta
            }
            html
          }
        }
      }
    }
  `);

  const tionscadailProjects = data.tionscadail.edges.filter(({ node }) => node);
  const revealTitle = useRef(null);
  const revealIntro = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealIntro.current, srConfig(100));
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  return (
    <StyledTionscadailSection id="tionscadail">
      <h2 className="numbered-heading" ref={revealTitle}>
        Tionscadail
      </h2>

      <p className="tionscadail-intro" ref={revealIntro}>
        A few things I’ve built on the web. I’m a fluent Irish speaker, and I’m particularly
        interested in building Irish-language educational technology.
      </p>

      <FeaturedGrid
        projects={tionscadailProjects}
        overline="Web Project"
        showcase
        revealRefs={revealProjects}
      />
    </StyledTionscadailSection>
  );
};

export default Tionscadail;
