import React from 'react';

// Smooth scrolling function
export const smoothScroll = (id: string): void => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};

// Intersection Observer to trigger animations when elements enter viewport
export const observeElementInView = (element: HTMLElement): void => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('animate-on-scroll')) {
            entry.target.classList.add('animate-fade-up');
          }
          
          // Find and animate children with animate-on-scroll class
          const animatedChildren = entry.target.querySelectorAll('.animate-on-scroll');
          animatedChildren.forEach((child) => {
            child.classList.add('animate-fade-up');
          });
          
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  
  observer.observe(element);
};