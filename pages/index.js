import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Playfair_Display } from 'next/font/google';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

const LOGO_PATH = '/L-logo-removebg-preview.png';

function IconFacebook({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.5 22v-8.3h2.8l.4-3.3h-3.2V8.8c0-.9.26-1.5 1.5-1.5H17V4.1A21.3 21.3 0 0014.3 4c-2.4 0-4 1.5-4 4.1v2.3H7.5v3.3H10V22h3.5z" />
    </svg>
  );
}

function IconInstagram({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 2a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM17.5 6.8a1 1 0 110 2 1 1 0 010-2z" />
    </svg>
  );
}

function IconMapPin({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" />
    </svg>
  );
}

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    fetchMenu();
    fetchPromotions();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      console.log('Menu data received:', data?.length || 0, 'items');
      const menuArray = Array.isArray(data) ? data : [];
      setMenu(menuArray);
    } catch (error) {
      console.error('Error fetching menu:', error);
      setMenu([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPromotions = async () => {
    try {
      const res = await fetch('/api/promotions');
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      const promoArray = Array.isArray(data) ? data : [];
      setPromotions(promoArray);
      if (promoArray.length > 0) {
        setSelectedPromotion(promoArray[0]);
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
      setPromotions([]);
    }
  };

  const groupByCategory = (items) => {
    const grouped = {};
    const itemsArray = Array.isArray(items) ? items : [];
    itemsArray.forEach(item => {
      const catName = item.category_name || item.category?.name || 'Unknown';
      if (!grouped[catName]) {
        grouped[catName] = [];
      }
      grouped[catName].push(item);
    });
    return grouped;
  };

  const closeModal = () => {
    setSelectedPromotion(null);
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Lucullus La Goulette</title>
        </Head>
        <div className={`${styles.loadingContainer} ${playfair.className}`}>
          <div className={styles.loader}></div>
          <p>Chargement du menu...</p>
        </div>
      </>
    );
  }

  const groupedMenu = groupByCategory(menu);
  const categoryOrder = [
    'Entrées', 'Pâtes', 'Viandes', 'Poissons', 'Desserts',
    'Vins rouges', 'Vins rosés', 'Vins blancs', 'Les Mousseux',
    'Les Softs', 'Les Biéres', 'Les Apéritif et Digestif', 'Les Liquers',
    'Les Champagnes', 'Côté Bar'
  ];
  
  const categoryLabels = {
    'Entrées': 'LES ENTRÉES',
    'Pâtes': 'LES PÂTES',
    'Viandes': 'SÉLECTION CARNÉE',
    'Poissons': 'DÉLICES MARINS',
    'Desserts': 'LES DESSERTS',
    'Vins rouges': 'VINS ROUGES',
    'Vins rosés': 'VINS ROSÉS',
    'Vins blancs': 'VINS BLANCS',
    'Les Mousseux': 'LES MOUSSEUX',
    'Les Softs': 'BIÈRES & SOFTS',
    'Les Biéres': 'LES BIÈRES',
    'Les Apéritif et Digestif': 'APÉRITIFS & DIGESTIFS',
    'Les Liquers': 'LES LIQUEURS',
    'Les Champagnes': 'LES CHAMPAGNES',
    'Côté Bar': 'CÔTÉ BAR'
  };
  
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];
  
  const categories = categoryOrder
    .filter(cat => groupedMenu[cat])
    .map((cat, idx) => ({ key: cat, label: categoryLabels[cat], roman: romanNumerals[idx] }));

  if (categories.length === 0 && !loading) {
    return (
      <>
        <Head>
          <title>Lucullus La Goulette</title>
        </Head>
        <div className={`${styles.container} ${playfair.className}`}>
          <div className={styles.emptyState}>
            <p>Aucun élément du menu disponible pour le moment.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Lucullus La Goulette - Menu Gourmet</title>
        <meta name="description" content="Découvrez notre menu raffiné - Restaurant Lucullus La Goulette" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={`${styles.container} ${playfair.className}`}>
        {/* Promotion Modal */}
        {selectedPromotion && (
          <div className={styles.modalOverlay} onClick={closeModal}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <button className={styles.closeBtn} onClick={closeModal}>✕</button>
              {selectedPromotion.image_url && (
                <img
                  src={selectedPromotion.image_url}
                  alt={selectedPromotion.title}
                  className={styles.promotionImage}
                />
              )}
              <div className={styles.promotionText}>
                <h2>{selectedPromotion.title}</h2>
                {selectedPromotion.description && (
                  <p>{selectedPromotion.description}</p>
                )}
                {(selectedPromotion.discount_percent || selectedPromotion.discount_amount) && (
                  <div className={styles.discountBadge}>
                    {selectedPromotion.discount_percent && (
                      <span className={styles.discountPercent}>-{selectedPromotion.discount_percent}%</span>
                    )}
                    {selectedPromotion.discount_amount && (
                      <span className={styles.discountAmount}>-{selectedPromotion.discount_amount} DT</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <header className={styles.header}>
          <div className={styles.logoBox} aria-label="Lucullus La Goulette">
            <Image
              src={LOGO_PATH}
              alt="Lucullus La Goulette"
              width={447}
              height={559}
              className={styles.logoImage}
              priority
              sizes="(max-width: 420px) 88vw, 280px"
            />
          </div>
          <h1 className={styles.siteTitle}>LA GOULETTE</h1>
          <p className={styles.tagline}>&ldquo;In Vino Veritas&rdquo;</p>
          <div className={styles.socialRow}>
            <a
              className={styles.socialBtn}
              href="https://www.facebook.com/lucullus.la.goulettee"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <IconFacebook className={styles.socialSvg} />
            </a>
            <a
              className={styles.socialBtn}
              href="https://www.instagram.com/lucullus_goulette/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <IconInstagram className={styles.socialSvg} />
            </a>
            <a
              className={styles.socialBtn}
              href="https://www.google.com/maps/place/R884%2BV33+Lucullus,+Av.+Franklin+Roosevelt,+La+Goulette/data=!4m2!3m1!1s0x12fd5b0050b9eabf:0x870b4d4353199aa8"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Localisation"
            >
              <IconMapPin className={styles.socialSvg} />
            </a>
          </div>
        </header>

        <main className={styles.menu}>
          <div className={styles.categoriesContainer}>
            {categories.map((cat, idx) => (
              <div key={cat.key} className={styles.categorySection}>
                <button
                  type="button"
                  className={`${styles.categoryHeader} ${expandedCategory === cat.key ? styles.expanded : ''}`}
                  onClick={() => setExpandedCategory(expandedCategory === cat.key ? null : cat.key)}
                  aria-expanded={expandedCategory === cat.key}
                >
                  <span className={styles.categoryLabel}>
                    {cat.roman} &ndash; {cat.label}
                  </span>
                  <span className={styles.chevron} aria-hidden />
                </button>

                {expandedCategory === cat.key && (
                  <div className={styles.categoryItems}>
                    {groupedMenu[cat.key].map((item) => (
                      <div key={item._id} className={styles.menuItem}>
                        <div className={styles.itemContent}>
                          <div className={styles.itemInfo}>
                            <h3 className={styles.itemName}>{item.name}</h3>
                            {item.description && (
                              <p className={styles.itemDescription}>{item.description}</p>
                            )}
                          </div>
                          <span className={styles.itemPrice}>{item.price} DT</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p>Restaurant Gourmet · La Goulette, Tunis</p>
            <p className={styles.footerLegal}>&copy; 2026 Lucullus La Goulette</p>
            <Link href="/admin" className={styles.footerAdmin}>
              Administration
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
}
