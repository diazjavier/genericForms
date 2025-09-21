
function toUpper(txtMin: string | undefined) {
    if(txtMin) {
        const txtMay = txtMin.toUpperCase();
        return txtMay;
    } else {
        return "";
    }
  };


export function getComercialesTodos () {
    return `select nne, nne_desc, codcombinado, unidades, precpub, precpubuni, comercial 
    from comerciales 
    where fecha = 20241105 
    and considerado = 1 
    and precpub > 0;`;
};

export function getComercialesById (elId: number) {
    return `select nne, nne_desc, codcombinado, unidades, precpub, precpubuni, comercial 
    from comerciales 
    where fecha = 20241105 
    and considerado = 1 
    and precpub > 0 
    and nne = ${elId};`;
};

export function getCompartivoComercialesTodos () {
    return `select distinct 
            k.codigo1 as codigo,
            k.nombrecomercial || ' ' ||k.formapresentacion as nombre 
            from alfabeta ab inner join kairos k on ab.troquel = k.troquel
            where k.dosis is not null
            and k.ppu is not null
            order by k.nombrecomercial || ' ' ||k.formapresentacion asc;`;
};

export function getComparativoComercialesDatos (codigo: string) {
    return `select 
            upper(k.droga_combo) as droga,
            k.dosis,
            k.forma10 as ff,
            cast(ab.unidades as varchar) as unidades
            --to_char(k.fechavigencia, 'DD/MM/YYYY') as fechavigencia
            from alfabeta ab inner join kairos k on ab.troquel = k.troquel
            where k.dosis is not null
            and k.ppu is not null
            and k.codigo1 = '${codigo}';`;
};

export function getComparativoComercialesChart (droga: string, dosis: string, ff: string, unidades: string) {
    return `  select 
                upper(k.droga_combo) as droga_combo,
                k.codigo1,
                k.nombrecomercial,
                k.formapresentacion,
                k.clavelab,
                k.laboratorio,
                ab.unidades as q, 
                --k.q,
                k.dosis,
                k.ppu,
                k.pvp,
                k.forma10,
                to_char(k.fechavigencia, 'DD/MM/YYYY') as fechavigencia
            from alfabeta ab inner join kairos k on ab.troquel = k.troquel
            where k.dosis is not null
            and k.ppu is not null
            and upper(k.droga_combo) = '${toUpper(droga)}'
            and k.dosis = '${dosis}' 
            and k.forma10 = '${ff}'
            and ab.unidades = ${unidades}
            order by k.pvp asc;`;
};

export function getCompartivoGenericosTodos () {
    // return `select distinct droga_combo 
    // from tableromacchia
    // where dosis is not null
    // and ppu is not null
    // order by droga_combo;`;  

    return `select distinct upper(k.droga_combo) as droga_combo
      from alfabeta ab inner join kairos k on ab.troquel = k.troquel
      where k.dosis is not null
      and k.ppu is not null
      order by droga_combo;`;

};

export function getComparativoDosis (droga: string |undefined) {

    // return `select distinct dosis 
    //     from tableromacchia
    //     where dosis is not null
    //     and ppu is not null
    //     and upper(droga_combo) = '${toUpper(droga)}';`;

        return `select distinct k.dosis
                from alfabeta ab inner join kairos k on ab.troquel = k.troquel
                where k.dosis is not null
                and k.ppu is not null
                and upper(k.droga_combo) = '${toUpper(droga)}'
                order by k.dosis;`;
};

export function getComparativoFormasFarmaceuticas (droga: string, dosis: string) {

    // return `select distinct forma10
    // from tableromacchia
    // where dosis is not null
    // and ppu is not null
    // and upper(droga_combo) = '${toUpper(droga)}'
    // and dosis = ${dosis};`

    return `select distinct k.forma10
            from alfabeta ab inner join kairos k on ab.troquel = k.troquel
            where k.dosis is not null
            and k.ppu is not null
            and upper(k.droga_combo) = '${toUpper(droga)}'
            and k.dosis = '${dosis}'            
            order by k.forma10;`
};

export function getUnidades (droga: string, dosis: string, ff: string){
    return `select distinct cast(ab.unidades as varchar) as unidades
    	    from alfabeta ab inner join kairos k on ab.troquel = k.troquel
            where k.dosis is not null
            and k.ppu is not null
            and upper(k.droga_combo) = '${toUpper(droga)}'
            and k.dosis = '${dosis}' 
            and k.forma10 = '${ff}'
            order by unidades;`;
};

export function getComparativoUnidadesChart (droga: string, dosis: string, ff: string){
    return `select 
                upper(k.droga_combo) as droga_combo,
                k.codigo1,
                k.nombrecomercial,
                k.formapresentacion,
                k.clavelab,
                k.laboratorio,
                ab.unidades as q,
                --k.q,
                k.dosis,
                k.ppu,
                k.pvp,
                k.forma10,
                to_char(k.fechavigencia, 'DD/MM/YYYY') as fechavigencia
            from alfabeta ab inner join kairos k on ab.troquel = k.troquel
            where k.dosis is not null
            and k.ppu is not null
            and upper(k.droga_combo) = '${toUpper(droga)}'
            and k.dosis = '${dosis}' 
            and k.forma10 = '${ff}'
            order by ab.unidades;`;
};