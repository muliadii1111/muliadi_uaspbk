// tests/components/AlbumCard.test.js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AlbumCard from '@/components/AlbumCard.vue'

describe('AlbumCard.vue', () => {
  it('menampilkan judul album dan artis', () => {
    const wrapper = mount(AlbumCard, {
      props: {
        album: {
          id: 1,
          title: 'Selamat Ulang Tahun',
          artist: 'Nadin Amizah',
          price: 50000,
          cover: 'https://i.imgur.com/Cov1rOE.jpg'
        }
      }
    })

    expect(wrapper.text()).toContain('Selamat Ulang Tahun')
    expect(wrapper.text()).toContain('Nadin Amizah')
    expect(wrapper.text()).toContain('Rp')
  })
})
