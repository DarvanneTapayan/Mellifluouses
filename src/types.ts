/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VideoProject {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  category: 'Cinematic' | 'Experimental' | 'Product';
}

export interface Testimony {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}
