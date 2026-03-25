import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';

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
      const data = await res.json();
      const menuArray = Array.isArray(data) ? data : (data?.items || data?.data || []);
      setMenu(menuArray);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menu:', error);
      setMenu([]);
      setLoading(false);
    }
  };

  const fetchPromotions = async () => {
    try {
      const res = await fetch('/api/promotions');
      const data = await res.json();
      const promoArray = Array.isArray(data) ? data : (data?.items || data?.data || []);
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
      const catName = item.category?.name || 'Unknown';
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
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>Chargement du menu...</p>
        </div>
      </>
    );
  }

  const groupedMenu = groupByCategory(menu);
  const categoryOrder = ['LES ENTRÉES', 'LES PÂTES', 'SÉLECTION CARNÉE', 'DÉLICES MARINS', 
                        'LES DESSERTS', 'LES VINS', 'LES MOUSSEUX', 'BIÈRES & SOFTS', 
                        'SPIRITUEUX', 'LES COCKTAILS'];
  const categories = categoryOrder.filter(cat => groupedMenu[cat]);

  if (categories.length === 0) {
    return (
      <>
        <Head>
          <title>Lucullus La Goulette</title>
        </Head>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <p>Menu en cours de chargement...</p>
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

      <div className={styles.container}>
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

        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.logo}>
              <h1>🍽️</h1>
            </div>
            <div className={styles.headerText}>
              <h1>Lucullus La Goulette</h1>
              <p>Restaurant Gourmet</p>
            </div>
          </div>
          <nav className={styles.nav}>
            <a href="/" className={styles.navLink + ' ' + styles.active}>Menu</a>
            <a href="/admin" className={styles.navLink}>Admin</a>
          </nav>
        </header>

        {/* Menu Categories */}
        <main className={styles.menu}>
          <div className={styles.menuHeader}>
            <h2>Notre Menu</h2>
            <p>Découvrez notre sélection de plats raffinés</p>
          </div>

          <div className={styles.categoriesContainer}>
            {categories.map((categoryName, idx) => (
              <div key={categoryName} className={styles.categorySection}>
                <button
                  className={`${styles.categoryHeader} ${expandedCategory === categoryName ? styles.expanded : ''}`}
                  onClick={() => setExpandedCategory(expandedCategory === categoryName ? null : categoryName)}
                >
                  <span className={styles.categoryIcon}>
                    {categoryName === 'LES ENTRÉES' && '🥘'}
                    {categoryName === 'LES PÂTES' && '🍝'}
                    {categoryName === 'SÉLECTION CARNÉE' && '🥩'}
                    {categoryName === 'DÉLICES MARINS' && '🦞'}
                    {categoryName === 'LES DESSERTS' && '🍰'}
                    {categoryName === 'LES VINS' && '🍷'}
                    {categoryName === 'LES MOUSSEUX' && '🥂'}
                    {categoryName === 'BIÈRES & SOFTS' && '🍺'}
                    {categoryName === 'SPIRITUEUX' && '🥃'}
                    {categoryName === 'LES COCKTAILS' && '🍹'}
                  </span>
                  <span className={styles.categoryTitle}>{categoryName}</span>
                  <span className={styles.categoryCount}>({groupedMenu[categoryName].length})</span>
                  <span className={styles.expandIcon}>
                    {expandedCategory === categoryName ? '−' : '+'}
                  </span>
                </button>

                {expandedCategory === categoryName && (
                  <div className={styles.categoryItems}>
                    {groupedMenu[categoryName].map((item) => (
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
            <p>&copy; 2026 Lucullus La Goulette. Tous droits réservés.</p>
            <p>Restaurant Gourmet • La Goulette, Tunis</p>
          </div>
        </footer>
      </div>
    </>
  );
}
